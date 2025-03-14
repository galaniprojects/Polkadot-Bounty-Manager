import { hideLoadingModal, showLoadingModal } from '../LoadingModal/loadingModalStores';
import type { AccountInfo } from '../../types/account';
import { fetchMultisigInfo } from './fetch-signatories';

export async function updateAccountMultisigsOnBlockchain(account: AccountInfo) {
	showLoadingModal('Fetching multisig accounts…', 'This might take a moment.');
	account.multisigs = await fetchMultisigInfo(account.address);
	hideLoadingModal();
}
