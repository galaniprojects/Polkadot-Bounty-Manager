import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { get } from 'svelte/store';
import { currentBlock, dotApi } from '../stores';

export function convertDotToPlanck(value: bigint): bigint {
	return value * BigInt(1e10);
}

export function convertPlanckToDot(value: number | bigint): number {
	if (typeof value === 'bigint') {
		if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
			throw new Error('Converting Planck to Dot failed, value is too big.');
		}
		return Number(value) / 1e10;
	}
	return value / 1e10;
}

/**
 * @returns if provided address ia a valid polkadot address.
 */
export function isValidAddress(address: string) {
	try {
		const decoded = decodeAddress(address, false, 0);
		const reEncoded = encodeAddress(decoded, 0);

		return reEncoded === address;
	} catch {
		return false;
	}
}

export type BlockInfo = {
	blockNumber: number;
	timestamp: number;
};

export async function getCurrentBlock(): Promise<BlockInfo> {
	const currentBlockFromStorage = get(currentBlock);
	if (currentBlockFromStorage) {
		return currentBlockFromStorage;
	} else {
		const api = get(dotApi);
		const info = {
			//TODO: is this correct?
			blockNumber: await api.query.System.Number.getValue(),
			timestamp: Date.now()
		};
		currentBlock.set(info);
		return info;
	}
}
