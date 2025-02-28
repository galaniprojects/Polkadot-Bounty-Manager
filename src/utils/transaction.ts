import type { Transaction, TxFinalizedPayload } from 'polkadot-api';
import { get } from 'svelte/store';
import { activeAccount, polkadotSigner } from '../stores';
import {
	hideLoadingModal,
	showErrorModal,
	showLoadingModal,
	showSuccessModal
} from '../components/modals';
import { fetchBountiesAndChildBounties } from './fetch-bounties';
import { truncateString } from './common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyTransaction = Transaction<any, string, string, unknown>;

/**
 * Signs and submits a transaction using an extension or Wallet Connect.
 *
 * The active account and the signer are retrieved from the store. This function does
 * not throw, but rather shows an error dialog if the transaction fails or shows a success
 * dialog with `successMessage` if the transaction goes through.
 **/
export async function submitTransaction(
	transaction: AnyTransaction,
	successMessage?: string
): Promise<TxFinalizedPayload | undefined> {
	try {
		const signer = get(polkadotSigner);
		if (!signer) {
			showErrorModal('Internal Error, signer is undefined.');
			return;
		}

		showLoadingModal('Submitting transaction…');

		const result = await transaction.signAndSubmit(signer);
		if (!result.dispatchError) {
			showSuccessModal('Transaction', successMessage || 'Operation success.');
			await fetchBountiesAndChildBounties(false);
			return result;
		}

		showErrorModal(readableError(result.dispatchError));
	} catch (e) {
		const account = get(activeAccount);
		if (!account) {
			showErrorModal('Internal error, active account not found.');
			return;
		}

		if (account.source !== 'WalletConnect') {
			showErrorModal(readableError(e));
			return;
		}

		console.error(e);
		showErrorModal(
			`Note: If you are using Multix, please disregard this message and proceed directly to Multix. (` +
				readableError(e) +
				')'
		);
	} finally {
		hideLoadingModal();
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

export function maybeTransaction(getter: () => AnyTransaction | '' | false | undefined) {
	try {
		return getter() || undefined;
	} catch (exception) {
		console.debug(exception);
		return undefined;
	}
}
