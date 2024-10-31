import type { Bounty } from '../types/bounty';
import type { ChildBounty } from '../types/child-bounty';
import { getCurrentBlock } from './polkadot';

export function isInteger(input: string) {
	const num = parseInt(input, 10);
	return Number.isInteger(num) && num.toString() === input;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseBounty(obj: any, id: number): Bounty {
	return {
		...obj,
		id,
		value: parseBalance(obj.value),
		fee: parseBalance(obj.fee),
		curatorDeposit: parseBalance(obj.curator_deposit),
		bond: parseBalance(obj.bond)
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseChildBounty(obj: any, id: number): ChildBounty {
	return {
		...obj,
		id,
		parentBounty: Number(obj.parentBounty),
		value: parseBalance(obj.value),
		fee: parseBalance(obj.fee),
		curatorDeposit: parseBalance(obj.curator_deposit)
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

export async function calculateExpirationDate(bounty: Bounty): Promise<Date | undefined> {
	if (typeof bounty.status === 'object' && 'Active' in bounty.status) {
		const currentBlockInfo = await getCurrentBlock();
		const blocksToExpire =
			Number(bounty.status.Active.updateDue.replaceAll(',', '')) - currentBlockInfo.blockNumber;
		return new Date(currentBlockInfo.timestamp + blocksToExpire * 6000);
	}
	return undefined;
}
