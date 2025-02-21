import { get } from 'svelte/store';
import { activeAccount, activeAccountBounties, bounties } from '../stores';
import { type Bounty } from '../types/bounty';

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
		if (bounty.proposer === address || bounty.curator === address) {
			filteredBounties.push(bounty);
			continue;
		}
		const filteredChildBounties = bounty.childBounties.filter(({ curator }) => curator === address);
		if (filteredChildBounties.length > 0) {
			bounty.childBounties = filteredChildBounties;
			filteredBounties.push(bounty);
		}
	}
	activeAccountBounties.set(filteredBounties);
}
