import { AccountId, getSs58AddressInfo } from 'polkadot-api';
import { isPositiveNumber } from './common';
import { get } from 'svelte/store';
import { blockChainMeta } from '../stores';

export function convertFormattedDotToPlanck(value: string): bigint {
	if (!isPositiveNumber(value)) {
		throw new Error('Provided value is invalid');
	}

	const parts = value.split('.');
	const integerPartInPlanck: bigint = convertDotToPlanck(BigInt(parts[0]));
	let decimalPart = parts[1] || '';

	if (decimalPart === '') {
		return integerPartInPlanck;
	}
	decimalPart = decimalPart.padEnd(10, '0');
	const decimalPartInPlack = BigInt(decimalPart);

	return integerPartInPlanck + decimalPartInPlack;
}

export function convertDotToPlanck(value: bigint): bigint {
	return value * get(blockChainMeta).multiplier;
}

export function formatPlanckToDot(value: bigint, nDecimals = 5): string {
	const precision = get(blockChainMeta).decimals;
	const precisionMultiplier = get(blockChainMeta).multiplier;

	if (nDecimals < precision) {
		value = value / 10n ** BigInt(precision - (nDecimals + 1));
		const rounded = Math.abs(Number(value % 10n)) > 4;
		const rounding = rounded ? (value < 0 ? -1n : 1n) : 0n;
		value = value / 10n + rounding;
		value *= 10n ** BigInt(precision - nDecimals);
	}
	const intPartStr = (value / precisionMultiplier).toLocaleString('en');
	const decimalPart = value % precisionMultiplier;
	if (decimalPart === 0n) {
		return intPartStr;
	}

	const newDecimalPart = decimalPart.toString().padStart(precision, '0').replace(/00*$/, '');
	return intPartStr + '.' + newDecimalPart;
}

/**
 * @returns if provided address ia a valid polkadot address.
 */
export function isValidAddress(address: string) {
	const info = getSs58AddressInfo(address);
	return info.isValid && info.ss58Format === get(blockChainMeta).ss58Format;
}

/**
 * converts an Ss58Address to a polkadot with prefix 0.
 */
export function convertToPolkadotAddress(address: string): string {
	const codec = AccountId(get(blockChainMeta).ss58Format);
	const addressInfo = getSs58AddressInfo(address);
	if (!addressInfo.isValid) {
		throw new Error('Could not decode account address');
	}
	return codec.dec(addressInfo.publicKey);
}

export type BlockInfo = {
	blockNumber: number;
	/**
	 * Timestamp in milliseconds since the Unix Epoch.
	 **/
	timestamp: number;
};
