import { get } from 'svelte/store';
import { bounties, activeAccount, activeAccountBounties } from '../stores';
import { BountyStatus, type Bounty, type BountyRaw } from '../types/bounty';
import { ChildBountyStatus, type ChildBounty, type ChildBountyRaw } from '../types/child-bounty';
import { calculateExpirationDate, formatDate } from './common';
import { getCurrentBlock } from './polkadot';

/**
 * Sets the store's `activeAccountBounties` value to filtered bounties
 * that are related to the `activeAccount` account only.
 */
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

export async function parseBounty(obj: BountyRaw, id: number): Promise<Bounty> {
	let status: BountyStatus;
	let curator: string | undefined = undefined;
	let expiryDate: Date | undefined = undefined;
	let beneficiary: string | undefined = undefined;

	switch (obj.status.type) {
		case 'Proposed':
			status = BountyStatus.Proposed;
			break;
		case 'Approved':
			status = BountyStatus.Approved;
			break;
		case 'Funded':
			status = BountyStatus.Funded;
			break;
		case 'CuratorProposed':
			status = BountyStatus.CuratorProposed;
			curator = obj.status.value.curator;
			break;
		case 'Active':
			status = BountyStatus.Active;
			curator = obj.status.value.curator;
			if ('update_due' in obj.status.value) {
				expiryDate = await calculateExpirationDate(obj.status.value.update_due);
			}
			break;
		case 'PendingPayout':
			curator = obj.status.value.curator;
			status = BountyStatus.PendingPayout;
			beneficiary = obj.status.value.beneficiary;
			break;
	}

	return {
		id,
		proposer: obj.proposer,
		value: obj.value,
		fee: obj.fee,
		curatorDeposit: obj.curator_deposit,
		bond: obj.bond,
		status,
		curator,
		expiryDate,
		childBounties: [],
		beneficiary
	};
}

export async function parseChildBounty(obj: ChildBountyRaw, id: number): Promise<ChildBounty> {
	let status: ChildBountyStatus;
	let curator: string | undefined;
	let dateOfPayout: string | undefined;
	let beneficiary: string | undefined;

	switch (obj.status.type) {
		case 'Added':
			status = ChildBountyStatus.Added;
			break;
		case 'CuratorProposed':
			status = ChildBountyStatus.SubCuratorProposed;
			curator = obj.status.value.curator;
			break;
		case 'Active':
			status = ChildBountyStatus.Active;
			curator = obj.status.value.curator;
			break;
		case 'PendingPayout': {
			curator = obj.status.value.curator;
			status = ChildBountyStatus.PendingPayout;
			const unlockAt = obj.status.value.unlock_at;
			const currentBlockInfo = await getCurrentBlock();
			const blocksToExpire = unlockAt - currentBlockInfo.blockNumber;
			dateOfPayout = formatDate(new Date(currentBlockInfo.timestamp + blocksToExpire * 6000));
			beneficiary = obj.status.value.beneficiary;
			break;
		}
	}
	return {
		id,
		parentBounty: obj.parent_bounty,
		value: obj.value,
		fee: obj.fee,
		curatorDeposit: obj.curator_deposit,
		status,
		curator,
		dateOfPayout,
		beneficiary
	};
}
