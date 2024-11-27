import type { PolkadotSigner, Transaction, TxFinalizedPayload } from 'polkadot-api';
import { get } from 'svelte/store';
import { activeAccount, injectedPolkadotAccount, walletConnectPolkadotSigner } from '../stores';
import { SupportedSources } from '../types/account';
import { showErrorDialog, showLoadingDialog, showSuccessDialog } from './loading-screen';
import { fetchBountiesAndChildBounties } from './fetch-bounties';
import { truncateString } from './common';
import { formatPlanckToDot } from './polkadot';

/**
 * Signs and submits a transaction using an extension or Wallet Connect.
 *
 * The active account and the signer are retrieved from the store. This function does
 * not throw, but rather shows an error dialog if the transaction fails or shows a success
 * dialog with `successMessage` if the transaction goes through.
 **/
export async function submitTransaction(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	transaction: Transaction<any, any, any, any>,
	successMessage?: string
): Promise<TxFinalizedPayload | undefined> {
	showLoadingDialog('Submitting transaction');
	const account = get(activeAccount);
	if (account === undefined) {
		showErrorDialog('Internal error, active account not found.');
		return;
	}
	if (account.source === SupportedSources.WalletConnect) {
		const signer = get(walletConnectPolkadotSigner);
		if (signer) {
			try {
				return await safeSignAndSubmit(transaction, signer, successMessage);
			} catch (e) {
				showErrorDialog(
					`Note: If you are using Multix, please disregard this message and proceed directly to Multix. (` +
						readableError(e) +
						')'
				);
				console.error(e);
			}
		} else {
			showErrorDialog('Internal error, wallet connect polkadot signer not set.');
		}
	} else {
		const injectedAccount = get(injectedPolkadotAccount);
		if (!injectedAccount) {
			showErrorDialog('Internal Error, injected account is undefined.');
			return;
		}
		try {
			return await safeSignAndSubmit(transaction, injectedAccount.polkadotSigner, successMessage);
		} catch (e) {
			showErrorDialog(readableError(e));
			return;
		}
	}
}

/**
 * Checks for dispatch errors after submitting.
 **/
async function safeSignAndSubmit(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	transaction: Transaction<any, any, any, any>,
	signer: PolkadotSigner,
	successMessage?: string
) {
	const result = await transaction.signAndSubmit(signer);
	if (result.dispatchError) {
		const dispatchError = readableError(result.dispatchError);
		showErrorDialog(dispatchError);
		return;
	} else {
		showSuccessDialog('Transaction', successMessage || 'Operation success.');
		await fetchBountiesAndChildBounties(false);
		return result;
	}
}

function readableError(error: unknown): string {
	if (typeof error === 'string') {
		return error;
	}

	if (typeof error !== 'object' || error === null) return '';

	if ('message' in error) {
		const message = error.message as string;
		try {
			error = JSON.parse(message);
		} catch {
			error = message;
		}
	}

	if (typeof error === 'object' && error !== null && 'type' in error) {
		let formatted = error.type as string;

		if ('value' in error) {
			const value = error.value as {
				type: string;
				value?: {
					type: string;
					value?: {
						type: string;
					};
				};
			};
			formatted = formatted + ', ' + value.type;
			if (value.value) {
				formatted = formatted + ', ' + value.value.type;
				if (value.value.value) {
					formatted = formatted + ', ' + value.value.value.type;
				}
			}
		}
		return formatted;
	}

	console.error(error);
	return 'Error was logged to the console. (' + truncateString(JSON.stringify(error), 150) + ')';
}

/**
 * Calculates a transaction fee, returns an error if calculating fee fails.
 **/
export async function calculateTransactionFee(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	transaction: Transaction<any, any, any, any>
): Promise<string> {
	const account = get(activeAccount);
	if (!account) {
		throw new Error('can not calculate fee, account is not set');
	}
	const paymentInfo = await transaction.getPaymentInfo(account.address);
	return formatPlanckToDot(paymentInfo.partial_fee);
}
