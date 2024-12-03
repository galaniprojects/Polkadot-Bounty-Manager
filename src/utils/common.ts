import { getCurrentBlock } from './polkadot';

/**
 * @returns `true` if `input` represents a positive integer or decimal number
 * and the number of decimal places does not exceed `maxPrecision`.
 */
export function isPositiveNumber(input: string, maxPrecision = 10): boolean {
	const positiveNumberRegex = /^\d+(\.\d+)?$/;
	if (!positiveNumberRegex.test(input)) {
		return false;
	}

	const decimalPart = input.split('.')[1] || '';
	return decimalPart.length <= maxPrecision;
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
