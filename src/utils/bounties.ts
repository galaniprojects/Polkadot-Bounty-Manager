import type { Bounty } from '../types/bounty';
import { get } from 'svelte/store';
import { bounties, activeAccount, activeAccountBounties } from '../stores';
import type { ChildBounty, ChildBountyStatus } from '../types/child-bounty';

export function SetActiveAccountBounties() {
	const allBounties: Bounty[] = get(bounties);
	const address = get(activeAccount)?.address;
	if (!address) {
		return;
	}

	const filteredBounties: Bounty[] = [];
	for (const bounty of allBounties) {
		if (bounty.proposer === address) {
			filteredBounties.push(bounty);
			continue;
		}

		if (typeof bounty.status === 'object') {
			if ('CuratorProposed' in bounty.status && bounty.status.CuratorProposed.curator === address) {
				filteredBounties.push(bounty);
				continue;
			}
			if ('Active' in bounty.status && bounty.status.Active.curator === address) {
				filteredBounties.push(bounty);
				continue;
			}
			if ('PendingPayout' in bounty.status && bounty.status.PendingPayout.curator === address) {
				filteredBounties.push(bounty);
				continue;
			}
		}
		const filteredChildBounties = filterChildBounties(bounty.childBounties, address);
		//TODO: do we want to keep all child bounties here?
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
		if (typeof childBounty.statusRaw === 'object') {
			if (
				'CuratorProposed' in childBounty.statusRaw &&
				childBounty.statusRaw.CuratorProposed.curator === address
			) {
				filteredChildBounties.push(childBounty);
				continue;
			}
			if ('Active' in childBounty.statusRaw && childBounty.statusRaw.Active.curator === address) {
				filteredChildBounties.push(childBounty);
				continue;
			}
			if (
				'PendingPayout' in childBounty.statusRaw &&
				childBounty.statusRaw.PendingPayout.curator === address
			) {
				filteredChildBounties.push(childBounty);
				continue;
			}
		}
	}
	return filteredChildBounties;
}

export function getBountyCurator(bounty: Bounty): string | undefined {
	if (typeof bounty.status === 'object') {
		if ('Active' in bounty.status) {
			return bounty.status.Active.curator;
		}
		if ('CuratorProposed' in bounty.status) {
			return bounty.status.CuratorProposed.curator;
		}
		if ('PendingPayout' in bounty.status) {
			return bounty.status.PendingPayout.curator;
		}
	}
	return undefined;
}

export function getChildBountyStatus(childBounty: ChildBounty): ChildBountyStatus | undefined {
	if (childBounty.statusRaw === 'Added') {
		return 'added';
	} else if (typeof childBounty.statusRaw === 'object') {
		if ('Active' in childBounty.statusRaw) {
			return 'active';
		} else if ('CuratorProposed' in childBounty.statusRaw) {
			return 'sub-curator proposed';
		} else if ('PendingPayout' in childBounty.statusRaw) {
			return 'pending payout';
		}
	}
	return undefined;
}
