import type { Transaction, TxFinalizedPayload } from 'polkadot-api';
import { get } from 'svelte/store';
import { activeAccount, injectedPolkadotAccount, walletConnectPolkadotSigner } from '../stores';
import { SupportedSources } from '../types/account';
import { showErrorDialog, showLoadingDialog, showSuccessDialog } from './loading-screen';
import { convertPlanckToDot } from './polkadot';
import { fetchBountiesAndChildBounties } from './fetch-bounties';

export async function submitTransaction(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	transaction: Transaction<any, any, any, any>,
	sucessMessage?: string
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
				const result = await transaction.signAndSubmit(signer);
				showSuccessDialog('Transaction', sucessMessage || 'Operation success.');
				await fetchBountiesAndChildBounties(false);
				return result;
			} catch (e) {
				showErrorDialog(
					'Submitting transaction failed. If you are using Multix, ignore this error and continue on Multix.'
				);
				console.error(e);
			}
		} else {
			showErrorDialog('Internal error, wallet connect polkadot signer not set!');
		}
	} else {
		const injectedAccount = get(injectedPolkadotAccount);
		if (!injectedAccount) {
			showErrorDialog('Internal Error, injected account is undefined.');
			return;
		}
		try {
			const result = await transaction.signAndSubmit(injectedAccount.polkadotSigner);
			await fetchBountiesAndChildBounties(false);
			showSuccessDialog('Transaction', sucessMessage || 'Operation success.');
			return result;
		} catch (e) {
			showErrorDialog(`${e}`);
			return;
		}
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
		const a = await transaction.getPaymentInfo(account.address);
		console.log(a);
		const x = String(convertPlanckToDot(a.partial_fee));

		console.log(x);
		return x;
	}
	throw new Error('No active account');
}
