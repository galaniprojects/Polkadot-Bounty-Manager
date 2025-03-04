import type { SS58String, Transaction, TxFinalizedPayload } from 'polkadot-api';
import { get } from 'svelte/store';
import { activeAccount, dotApi, polkadotSigner } from '../stores';
import { showErrorDialog, showLoadingDialog, showSuccessDialog } from './loading-screen';
import { fetchBountiesAndChildBounties } from './fetch-bounties';
import { truncateString } from './common';
import { getMultisigSigner, getProxySigner } from '@polkadot-api/meta-signers';
import type { MultisigInfo } from '../types/account';
import { MultiAddress } from '@polkadot-api/descriptors';
import type { Bounty } from '../types/bounty';
import type { ChildBounty } from '../types/child-bounty';

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
	successMessage?: string,
	tryUseMultisig?: Bounty | ChildBounty
): Promise<TxFinalizedPayload | undefined> {
	const proxyAddress = tryUseMultisig?.curator;
	const multisigAddress = tryUseMultisig?.curatorMultisigAccount;
	try {
		let signer = get(polkadotSigner);
		if (!signer) {
			showErrorDialog('Internal Error, signer is undefined.');
			return;
		}

		const typedApi = get(dotApi);
		let calldata = undefined;

		// In case it's multisig transaction.
		if (proxyAddress && multisigAddress) {
			const matchingMultisig: MultisigInfo | undefined = get(activeAccount)?.multisigs?.find(
				(multisig) => multisig.address === multisigAddress
			);
			if (!matchingMultisig) {
				showErrorDialog('Internal Error, multisig not found.');
				return;
			}

			const multisigSigner = getMultisigSigner(
				matchingMultisig,
				typedApi.query.Multisig.Multisigs.getValue,
				typedApi.apis.TransactionPaymentApi.query_info,
				signer,
				{
					method: () => 'as_multi'
				}
			);

			signer = getProxySigner({ real: proxyAddress as SS58String }, multisigSigner);

			const transactionWithProxy = get(dotApi).tx.Proxy.proxy({
				real: MultiAddress.Id(proxyAddress),
				force_proxy_type: undefined,
				call: transaction.decodedCall
			});

			calldata = (await transactionWithProxy.getEncodedData()).asHex();
		}

		showLoadingDialog('Submitting transaction');
		const result = await transaction.signAndSubmit(signer);

		if (!result.dispatchError) {
			showSuccessDialog('Transaction', successMessage || 'Operation success.', calldata);
			await fetchBountiesAndChildBounties(false);
			return result;
		}

		showErrorDialog(readableError(result.dispatchError));
	} catch (e) {
		const account = get(activeAccount);
		if (!account) {
			showErrorDialog('Internal error, active account not found.');
			return;
		}

		if (account.source !== 'WalletConnect') {
			showErrorDialog(readableError(e));
			return;
		}

		console.error(e);
		showErrorDialog(
			`Note: If you are using Multix, please disregard this message and proceed directly to Multix. (` +
				readableError(e) +
				')'
		);
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
