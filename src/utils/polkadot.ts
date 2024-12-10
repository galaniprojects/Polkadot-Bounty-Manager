import { get } from 'svelte/store';
import { currentBlock, dotApi } from '../stores';
import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat';
import { AccountId, createClient, getSs58AddressInfo } from 'polkadot-api';
import { dot } from '@polkadot-api/descriptors';
import { WsEvent } from '@polkadot-api/ws-provider/web';
import { getWsProvider } from 'polkadot-api/ws-provider/web';
import { isPositiveNumber } from './common';

export function createTypedApi(endpoints: string[]) {
	const sdkProvider = withPolkadotSdkCompat(getWsProvider({
		endpoints,
		timeout: 5000,
		onStatusChanged(event) {
			if (event.type !== WsEvent.CONNECTED) return;
			console.log(`Connected to ${event.uri}`);
		}
	}));
	const sdkClient = createClient(sdkProvider);
	return sdkClient.getTypedApi(dot);
}

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
	return value * BigInt(1e10);
}

export function formatPlanckToDot(value: bigint, nDecimals = 5, precision = 10): string {
	const precisionMultiplier = 10n ** BigInt(precision);

	if (nDecimals < precision) {
		value = value / 10n ** BigInt(precision - (nDecimals + 1));
		const rounded = Math.abs(Number(value % 10n)) > 4;
		const rounding = rounded ? (value < 0 ? -1n : 1n) : 0n;
		value = value / 10n + rounding;
		value *= 10n ** BigInt(precision - nDecimals);
	}
	const intPartStr = (value / precisionMultiplier).toString();
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
	return info.isValid && info.ss58Format === 0;
}

/**
 * converts an Ss58Address to a polkadot with prefix 0.
 */
export function convertToPolkadotAddress(address: string): string {
	const codec = AccountId(0);
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

export async function getCurrentBlock(): Promise<BlockInfo> {
	const currentBlockFromStorage = get(currentBlock);
	if (currentBlockFromStorage) {
		return currentBlockFromStorage;
	} else {
		const api = get(dotApi);
		const info = {
			blockNumber: await api.query.System.Number.getValue(),
			timestamp: Date.now()
		};
		currentBlock.set(info);
		return info;
	}
}
