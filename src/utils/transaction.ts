import type { Transaction, TxFinalizedPayload } from 'polkadot-api';
import { get } from 'svelte/store';
import { activeAccount, dotApi, polkadotSigner } from '../stores';
import {
	hideLoadingModal,
	showErrorModal,
	showLoadingModal,
	showSuccessModal
} from '../components/modals';
import { fetchBountiesAndChildBounties } from './fetch-bounties';
import { truncateString } from './common';
import { getMultisigSigner, getProxySigner } from '@polkadot-api/meta-signers';
import { MultiAddress } from '@polkadot-api/descriptors';
import type { Bounty } from '../types/bounty';
import type { ChildBounty } from '../types/child-bounty';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyTransaction = Transaction<any, string, string, unknown>;

class InternalError extends Error {}

async function getSignerAndCallData(
	transaction: AnyTransaction,
	proxyAddress?: string,
	multisigAddress?: string
) {
	const signer = get(polkadotSigner);
	if (!signer) {
		throw new InternalError('Internal Error, signer is undefined.');
	}

	if (!proxyAddress || !multisigAddress) {
		// multisig not required
		return { signer };
	}

	const multisigs = get(activeAccount)?.multisigs;
	const multisigInfo = multisigs?.find(({ address }) => address === multisigAddress);
	if (!multisigInfo) {
		throw new InternalError('Internal Error, multisig not found.');
	}

	const api = get(dotApi);
	const multisigSigner = getMultisigSigner(
		multisigInfo,
		api.query.Multisig.Multisigs.getValue,
		api.apis.TransactionPaymentApi.query_info,
		signer,
		{ method: () => 'as_multi' }
	);

	const transactionWithProxy = api.tx.Proxy.proxy({
		real: MultiAddress.Id(proxyAddress),
		force_proxy_type: undefined,
		call: transaction.decodedCall
	});

	return {
		signer: getProxySigner({ real: proxyAddress }, multisigSigner),
		callData: (await transactionWithProxy.getEncodedData()).asHex()
	};
}

/**
 * Signs and submits a transaction using an extension or Wallet Connect.
 *
 * The active account and the signer are retrieved from the store. This function does
 * not throw, but rather shows an error dialog if the transaction fails or shows a success
 * dialog with `successMessage` if the transaction goes through.
 **/
export async function submitTransaction(
	transaction: AnyTransaction,
	tryUseMultisig?: Bounty | ChildBounty
): Promise<TxFinalizedPayload | undefined> {
	try {
		const { signer, callData } = await getSignerAndCallData(
			transaction,
			tryUseMultisig?.curator,
			tryUseMultisig?.curatorMultisigAccount
		);

		showLoadingModal(
			'Submitting transaction…',
			'Waiting for transaction to be included in finalized block.'
		);

		const result = await transaction.signAndSubmit(signer);

		if (!result.dispatchError) {
			showSuccessModal('Transaction', 'Transaction finalized.', callData);

			(async () => {
				// trigger update in the background but return immediately
				await fetchBountiesAndChildBounties(false);
			})();
			return result;
		}

		showErrorModal(readableError(result.dispatchError));
	} catch (exception) {
		if (exception instanceof InternalError) {
			showErrorModal(exception.message);
			return;
		}

		const account = get(activeAccount);
		if (!account) {
			showErrorModal('Internal error, active account not found.');
			return;
		}

		const readable = readableError(exception);
		if (account.source !== 'WalletConnect') {
			showErrorModal(readable);
			return;
		}

		console.error(exception);
		showErrorModal(
			`Note: If you are using Multix, please disregard this message and proceed directly to Multix. (${readable})`
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
