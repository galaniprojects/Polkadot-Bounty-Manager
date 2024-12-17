import { get } from 'svelte/store';
import { activeAccount, activeAccountBounties, bounties } from '../stores';
import { type Bounty, type BountyRaw } from '../types/bounty';
import { type ChildBounty, type ChildBountyRaw } from '../types/child-bounty';
import { calculateExpirationDate, formatDate } from './common';

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
		const filteredChildBounties = filterChildBounties(bounty.childBounties, address);
		if (filteredChildBounties.length > 0) {
			bounty.childBounties = filteredChildBounties;
			filteredBounties.push(bounty);
		}
	}
	activeAccountBounties.set(filteredBounties);
}

function filterChildBounties(bounties: ChildBounty[], address: string): ChildBounty[] {
	return bounties.filter(({ curator }) => curator === address);
}

export function parseBounty(raw: BountyRaw, id: number, currentBlock: number) {
	const { bond, curator_deposit: curatorDeposit, fee, proposer, value } = raw;
	const { type } = raw.status;

	const curator = ['CuratorProposed', 'Active', 'PendingPayout'].includes(type)
		? raw.status.value?.curator
		: undefined;

	const result: Bounty = {
		id,
		proposer,
		value,
		fee,
		curatorDeposit,
		bond,
		status: type,
		curator,
		childBounties: []
	};

	if (type === 'PendingPayout') {
		const { beneficiary } = raw.status.value;
		return { beneficiary, ...result };
	}

	if (type === 'Active' && 'update_due' in raw.status.value) {
		const expiryDate = calculateExpirationDate(raw.status.value.update_due, currentBlock);
		return { expiryDate, ...result };
	}

	return result;
}

export function parseChildBounty(raw: ChildBountyRaw, id: number, currentBlock: number) {
	const { fee, value, parent_bounty: parentBounty, curator_deposit: curatorDeposit } = raw;
	const { type } = raw.status;

	const curator = ['CuratorProposed', 'Active', 'PendingPayout'].includes(type)
		? raw.status.value?.curator
		: undefined;

	const result: ChildBounty = {
		id,
		value,
		fee,
		parentBounty,
		curatorDeposit,
		status: type,
		curator
	};

	if (type !== 'PendingPayout') {
		return result;
	}

	const { beneficiary, unlock_at: unlockAt } = raw.status.value;
	const dateOfPayout = formatDate(calculateExpirationDate(unlockAt, currentBlock));

	return {
		...result,
		dateOfPayout,
		beneficiary
	};
}
