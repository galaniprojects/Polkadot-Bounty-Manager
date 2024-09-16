import type { Bounty } from '../types/bounty';

export function isInteger(input: string) {
	const num = parseInt(input, 10);
	return Number.isInteger(num) && num.toString() === input;
}

export function parseBounty(obj: any, id: number): Bounty { 
	return {
		...obj,
		id,
		value: parseBalance(obj.value),
		fee: parseBalance(obj.fee),
		curatorDeposit: parseBalance(obj.curator_deposit),
		bond: parseBalance(obj.bond),
	}
}

function parseBalance(balance: string | undefined): bigint {
	if (!balance) {
		return BigInt(0);
	}
	// Remove commas or spaces from the balance string.
	const cleanedBalance = balance.replace(/[, ]/g, '');
	return BigInt(cleanedBalance);
}
