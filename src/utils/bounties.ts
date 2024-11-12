import { type Bounty } from '../types/bounty';
import { get } from 'svelte/store';
import { bounties, activeAccount, activeAccountBounties } from '../stores';
import type { ChildBounty } from '../types/child-bounty';

export function SetActiveAccountBounties() {
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
		const filteredChildBounties = filterChildBounties(bounty.childBounties, address);
		if (filteredChildBounties.length > 0) {
			bounty.childBounties = filteredChildBounties;
			filteredBounties.push(bounty);
		}
	}
	activeAccountBounties.set(filteredBounties);
}

function filterChildBounties(childBounties: ChildBounty[], address: string): ChildBounty[] {
	const filteredChildBounties: ChildBounty[] = [];
	for (const childBounty of childBounties) {
		if (childBounty.curator === address) {
			filteredChildBounties.push(childBounty);
		}
	}
	return filteredChildBounties;
}
