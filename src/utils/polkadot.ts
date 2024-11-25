import { get } from 'svelte/store';
import { currentBlock, dotApi } from '../stores';
import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat';
import { AccountId, createClient, getSs58AddressInfo } from 'polkadot-api';
import { dot } from '@polkadot-api/descriptors';
import { getWsProvider } from 'polkadot-api/ws-provider/web';

export function createTypedApi(nodeEndpoint: string) {
	const sdkProvider = withPolkadotSdkCompat(getWsProvider(nodeEndpoint));
	const sdkClient = createClient(sdkProvider);
	return sdkClient.getTypedApi(dot);
}

export function convertDotToPlanck(value: bigint): bigint {
	return value * BigInt(1e10);
}

export function convertPlanckToDot(value: bigint): bigint {
	if (typeof value === 'number') {
		value = BigInt(value);
	}
return value / BigInt(1e10);
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
