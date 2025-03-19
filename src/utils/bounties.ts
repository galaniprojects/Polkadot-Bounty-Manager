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
	const address = get(activeAccount)?.address;
	if (!address) {
		return;
	}

	const filteredBounties: Bounty[] = [];
	for (const bounty of allBounties) {
		if (bounty.proposer === address || isCurator(bounty, get(activeAccount))) {
			filteredBounties.push(bounty);
			continue;
		}
		const filteredChildBounties = bounty.childBounties.filter((cb) =>
			isCurator(cb, get(activeAccount))
		);
		if (filteredChildBounties.length > 0) {
			bounty.childBounties = filteredChildBounties;
			filteredBounties.push(bounty);
		}
	}
	activeAccountBounties.set(filteredBounties);
}
