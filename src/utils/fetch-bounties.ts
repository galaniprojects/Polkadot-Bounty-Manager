import { bounties as bountiesStore, dotApi } from '../stores';
import { hideLoadingDialog, showErrorDialog, showLoadingDialog } from './loading-screen';
import { setActiveAccountBounties } from './bounties';
import { get } from 'svelte/store';
import { fetchBountiesFromDoTreasury } from './fetchBountiesFromDoTreasury';
import { fetchBountiesFromBlockchain } from './fetchBountiesFromBlockchain';
import { keyBy } from './keyBy';
import { calculateExpirationDate, formatDate } from './common';

/**
 * Fetches all bounties, child bounties and their descriptions, sorts them,
 * and sets them in the store under `bounties`.
 * Also updates the ActiveAccountBounties.
 */
export async function fetchBountiesAndChildBounties(showProgress = true) {
	try {
		if (showProgress) {
			showLoadingDialog('Loading...');
		}
		const bounties = await fetchBountiesFromBlockchain();
		const doTreasuryBounties = await fetchBountiesFromDoTreasury();

		const childBounties = bounties.flatMap(({ childBounties }) => childBounties);
		const doTreasuryChildBounties = doTreasuryBounties.flatMap(
			({ childBounties }) => childBounties
		);

		const bountiesMap = keyBy(bounties, 'id');
		const childBountiesMap = keyBy(childBounties, 'id');

		// merge parent bounties
		const missingBounties = doTreasuryBounties.filter(({ id }) => !(id in bountiesMap));
		bounties.push(...missingBounties);

		// merge child bounties
		const missingChildBounties = doTreasuryChildBounties.filter(
			({ id }) => !(id in childBountiesMap)
		);
		bounties.forEach(({ id, childBounties }) => {
			childBounties.push(...missingChildBounties.filter(({ parentBounty }) => id === parentBounty));
		});

		bounties.sort((a, b) => (a.id > b.id ? -1 : 1));
		bounties.forEach(({ childBounties }) => {
			childBounties.sort((a, b) => (a.id > b.id ? -1 : 1));
		});

		const api = get(dotApi);
		await api.query.System.BlockWeight.getValue(); // somehow makes the next query work
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

		if (showProgress) {
			hideLoadingDialog();
		}
	} catch (e) {
		console.error(e);
		if (showProgress) {
			showErrorDialog('Error while loading bounty details');
		}
	}
}
