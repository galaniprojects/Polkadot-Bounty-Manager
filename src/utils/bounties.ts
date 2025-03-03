import { get } from 'svelte/store';
import { activeAccount, activeAccountBounties, bounties } from '../stores';
import { type Bounty } from '../types/bounty';
import { isCurator } from './isCurator';

/**
 * Sets the store's `activeAccountBounties` value to filtered bounties
 * that are related to the `activeAccount` account only.
 */
export function setActiveAccountBounties() {
	const allBounties: Bounty[] = get(bounties);
	const account = get(activeAccount);
	if (!account) {
		return;
	}
	const address = account.address;

	const filteredBounties: Bounty[] = [];
	for (const bounty of allBounties) {
		if (bounty.proposer === address || isCurator(bounty)) {
			filteredBounties.push(bounty);
			continue;
		}
		const filteredChildBounties = bounty.childBounties.filter((childBounty) =>
			isCurator(childBounty)
		);
		console.log(filteredChildBounties);
		if (filteredChildBounties.length > 0) {
			bounty.childBounties = filteredChildBounties;
			filteredBounties.push(bounty);
		}
	}
	activeAccountBounties.set(filteredBounties);
}
