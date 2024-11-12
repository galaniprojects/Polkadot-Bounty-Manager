import { BountyStatus, type Bounty, type BountyRaw } from '../types/bounty';
import { ChildBountyStatus, type ChildBounty, type ChildBountyRaw } from '../types/child-bounty';
import { getCurrentBlock } from './polkadot';

export function isInteger(input: string) {
	const num = parseInt(input, 10);
	return Number.isInteger(num) && num.toString() === input;
}

export async function parseBounty(obj: BountyRaw, id: number): Promise<Bounty> {
	let status: BountyStatus;
	let curator: string | undefined = undefined;
	let expiryDate: Date | undefined = undefined;
	if (obj.status === 'Proposed') {
		status = BountyStatus.Proposed;
	} else if (obj.status === 'Approved') {
		status = BountyStatus.Approved;
	} else if (obj.status === 'Funded') {
		status = BountyStatus.Funded;
	} else if (typeof obj.status === 'object') {
		if ('Active' in obj.status) {
			status = BountyStatus.Active;
			curator = obj.status.Active.curator;
			expiryDate = await calculateExpirationDate(obj.status.Active.updateDue);
		} else if ('CuratorProposed' in obj.status) {
			status = BountyStatus.CuratorProposed;
			curator = obj.status.CuratorProposed.curator;
		} else if ('PendingPayout' in obj.status) {
			curator = obj.status.PendingPayout.curator;
			status = BountyStatus.PendingPayout;
		} else {
			throw new Error('unexpected bounty structure');
		}
	} else {
		throw new Error('unexpected bounty structure');
	}

	return {
		id,
		proposer: obj.proposer,
		value: parseBalance(obj.value),
		fee: parseBalance(obj.fee),
		curatorDeposit: parseBalance(obj.curatorDeposit),
		bond: parseBalance(obj.bond),
		status,
		statusRaw: obj.status,
		curator,
		expiryDate,
		childBounties: []
	};
}

export async function parseChildBounty(obj: ChildBountyRaw, id: number): Promise<ChildBounty> {
	let status: ChildBountyStatus;
	let curator: string | undefined;
	let dateOfPayout: string | undefined;
	let beneficiary: string | undefined;

	if (obj.status === 'Added') {
		status = ChildBountyStatus.Added;
	} else if (typeof obj.status === 'object') {
		if ('Active' in obj.status) {
			status = ChildBountyStatus.Active;
			curator = obj.status.Active.curator;
		} else if ('CuratorProposed' in obj.status) {
			status = ChildBountyStatus.SubCuratorProposed;
			curator = obj.status.CuratorProposed.curator;
		} else if ('PendingPayout' in obj.status) {
			curator = obj.status.PendingPayout.curator;
			status = ChildBountyStatus.PendingPayout;
			const unlockAt = Number(obj.status.PendingPayout.unlockAt.replace(/[, ]/g, ''));
			const currentBlockInfo = await getCurrentBlock();
			const blocksToExpire = unlockAt - currentBlockInfo.blockNumber;
			dateOfPayout = formatDate(new Date(currentBlockInfo.timestamp + blocksToExpire * 6000));
			beneficiary = obj.status.PendingPayout.beneficiary;
		} else {
			throw new Error(`Unexpected status type: ${obj.status}`);
		}
	} else {
		throw new Error(`Unexpected status type: ${obj.status}`);
	}
	return {
		id,
		parentBounty: Number(obj.parentBounty),
		value: parseBalance(obj.value),
		fee: parseBalance(obj.fee),
		curatorDeposit: parseBalance(obj.curatorDeposit),
		statusRaw: obj.status,
		status,
		curator,
		dateOfPayout,
		beneficiary
	};
}

function parseBalance(balance: string | undefined): bigint {
	if (!balance) {
		return BigInt(0);
	}
	// Remove commas or spaces from the balance string.
	const cleanedBalance = balance.replace(/[, ]/g, '');
	return BigInt(cleanedBalance);
}

export function truncateString(input: string, maxLength: number) {
	if (input.length > maxLength) {
		return input.slice(0, maxLength) + '...';
	} else {
		return input;
	}
}

export function formatDate(date: Date): string {
	return date
		.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		})
		.toUpperCase();
}

async function calculateExpirationDate(updateDue: string): Promise<Date> {
	const currentBlockInfo = await getCurrentBlock();
	const blocksToExpire = Number(updateDue.replaceAll(',', '')) - currentBlockInfo.blockNumber;
	return new Date(currentBlockInfo.timestamp + blocksToExpire * 6000);
}
