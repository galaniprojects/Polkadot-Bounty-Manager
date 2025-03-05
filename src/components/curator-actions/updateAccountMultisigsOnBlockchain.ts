import { get } from 'svelte/store';
import { hideLoadingModal, showLoadingModal } from '../LoadingModal/loadingModalStores';
import { activeAccount } from '../../stores';
import { fetchMultisigInfo } from './fetch-signatories';

export async function updateAccountMultisigsOnBlockchain() {
	const account = get(activeAccount);
	if (!account) return;

	showLoadingModal('Fetching multisig accounts…');
	account.multisigs = await fetchMultisigInfo(account.address);
	hideLoadingModal();
}
