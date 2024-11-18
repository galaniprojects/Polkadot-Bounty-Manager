import type { Transaction, TxFinalizedPayload } from 'polkadot-api';
import { get } from 'svelte/store';
import { activeAccount, injectedPolkadotAccount, walletConnectPolkadotSigner } from '../stores';
import { SupportedSources } from '../types/account';
import { showErrorDialog, showLoadingDialog, showSuccessDialog } from './loading-screen';
import { convertPlanckToDot } from './polkadot';

export async function submitTransaction(
	transaction: Transaction<any, any, any, any>,
	sucessMessage?: string
): Promise<TxFinalizedPayload | undefined> {
	showLoadingDialog('Submitting transaction');
	let account = get(activeAccount);
	if (account === undefined) {
		showErrorDialog('Internal error, active account not found.');
		return;
	}
	if (account.source === SupportedSources.WalletConnect) {
		let signer = get(walletConnectPolkadotSigner);
		if (signer) {
			try {
				let result = await transaction.signAndSubmit(signer);
				showSuccessDialog('Transaction', sucessMessage || 'Operation success.');
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
		let injectedAccount = get(injectedPolkadotAccount);
		if (!injectedAccount) {
			showErrorDialog('Internal Error, injected account is undefined.');
			return;
		}
		try {
			let result = await transaction.signAndSubmit(injectedAccount.polkadotSigner);
			showSuccessDialog('Transaction', sucessMessage || 'Operation success.');
			return result;
		} catch (e) {
			showErrorDialog(`${e}`);
			return;
		}
	}
}

export async function calculateTransactionFee(
	transaction: Transaction<any, any, any, any>
): Promise<string> {
	const account = get(activeAccount);
	if (!account) {
		throw new Error('can not calculate fee, account is not set');
	}

	if (account) {
		let a = await transaction.getPaymentInfo(account.address);
		console.log(a);
		let x = String(convertPlanckToDot(a.partial_fee));

		console.log(x);
		return x;
	}
	throw new Error('No active account');
}
