import { bounties as bountiesStore, dotApi } from '../stores';
import { hideLoadingModal, showErrorModal, showLoadingModal } from '../components/modals';
import { setActiveAccountBounties } from './bounties';
import { get } from 'svelte/store';
import { fetchBountiesFromBlockchain } from './fetchBountiesFromBlockchain';
import { addBountiesFromDoTreasury } from './addBountiesFromDoTreasury';
import { calculateExpirationDate, formatDate } from './common';
import { addCuratorMultisigAccounts } from './addCuratorMultisigAccounts';

/**
 * Fetches all bounties, child bounties and their descriptions, sorts them,
 * and sets them in the store under `bounties`.
 * Also updates the ActiveAccountBounties.
 */
export async function fetchBountiesAndChildBounties(showProgress = true) {
	try {
		if (showProgress) {
			showLoadingModal('Loading…');
		}

		const bounties = await fetchBountiesFromBlockchain();

		try {
			// get optional data about inactive bounties from doTreasury API
			await addBountiesFromDoTreasury(bounties);
		} catch (exception) {
			// log the error for developers but continue normally even if doTreasury is down
			console.error(exception);
		}

		await addCuratorMultisigAccounts(bounties);

		bounties.sort((a, b) => (a.id > b.id ? -1 : 1));
		bounties.forEach(({ childBounties }) => {
			childBounties.sort((a, b) => (a.id > b.id ? -1 : 1));
		});

		const api = get(dotApi);
		const currentBlock = await api.query.System.Number.getValue();
		bounties.forEach((bounty) => {
			if (bounty.updateDue) {
				bounty.expiryDate = calculateExpirationDate(bounty.updateDue, currentBlock);
			}
			bounty.childBounties.forEach((childBounty) => {
				if (childBounty.unlockAt) {
					const expiryDate = calculateExpirationDate(childBounty.unlockAt, currentBlock);
					childBounty.dateOfPayout = formatDate(expiryDate);
				}
			});
		});

		bountiesStore.set(bounties);
		setActiveAccountBounties();
	} catch (error) {
		console.error(error);
		if (showProgress) {
			showErrorModal('Error while loading bounty details');
		}
	} finally {
		if (showProgress) {
			hideLoadingModal();
		}
	}
}
