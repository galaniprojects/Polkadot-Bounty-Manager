import { getCurrentBlock } from './polkadot';

export function isInteger(input: string): boolean {
	const num = parseInt(input, 10);
	return Number.isInteger(num) && num.toString() === input;
}

export function truncateString(input: string, maxLength: number) {
	if (input.length > maxLength) {
		return input.slice(0, maxLength) + '...';
	} else {
		return input;
	}
}

/**
 * Formats a date `FEB 23, 2025`.
 */
export function formatDate(date: Date): string {
	return date
		.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		})
		.toUpperCase();
}

/**
 * Given a block number, calculates the estimated time when this block number will
 * be finalized.
 */
export async function calculateExpirationDate(updateDue: number): Promise<Date> {
	const currentBlockInfo = await getCurrentBlock();
	const blocksToExpire = updateDue - currentBlockInfo.blockNumber;
	return new Date(currentBlockInfo.timestamp + blocksToExpire * 6000);
}
