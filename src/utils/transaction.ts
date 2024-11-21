import type { PolkadotSigner, Transaction, TxFinalizedPayload } from 'polkadot-api';
import { get } from 'svelte/store';
import { activeAccount, injectedPolkadotAccount, walletConnectPolkadotSigner } from '../stores';
import { SupportedSources } from '../types/account';
import { showErrorDialog, showLoadingDialog, showSuccessDialog } from './loading-screen';
import { convertPlanckToDot } from './polkadot';
import { fetchBountiesAndChildBounties } from './fetch-bounties';

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
					readableError(e) +
						`. Note: If you are using Multix, you may ignore this error and continue on Multix.`
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
	} else if (result.ok) {
		showSuccessDialog('Transaction', successMessage || 'Operation success.');
		await fetchBountiesAndChildBounties(false);
		return result;
	} else {
		showErrorDialog('Unknown error happened.');
		return;
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readableError(error: any): string {
	if (error.message) {
try{
		error = JSON.parse(error.message);
} catch {
error = error.message
}
	}
	if (error.type) {
		let formatted = error.type;

		if (error.value) {
			formatted = formatted + ', ' + error.value.type;
			if (error.value.value) {
				formatted = formatted + ', ' + error.value.value.type;
				if (error.value.value.value) {
					formatted = formatted + ', ' + error.value.value.value.type;
				}
			}
		}
		return formatted;
	} else {
		console.error(error);
		return 'Error was logged to the console.';
	}
}

export async function calculateTransactionFee(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	transaction: Transaction<any, any, any, any>
): Promise<string> {
	const account = get(activeAccount);
	if (!account) {
		throw new Error('can not calculate fee, account is not set');
	}

	if (account) {
		const paymentInfo = await transaction.getPaymentInfo(account.address);
		return String(convertPlanckToDot(paymentInfo.partial_fee));
	}
	throw new Error('No active account');
}
