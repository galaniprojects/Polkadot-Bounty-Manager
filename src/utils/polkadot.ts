import { ApiRx, WsProvider } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ISubmittableResult } from '@polkadot/types/types';
import { firstValueFrom, filter } from 'rxjs';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { web3FromSource } from '@polkadot/extension-dapp';
import { get } from 'svelte/store';
import {
	currentBlock,
	nodeEndpoint,
	walletConnectProvider,
	walletConnectSession,
	dotApi
} from '../stores';
import { fetchBountiesAndChildBounties } from './fetch-bounties';
import { SupportedSources, type AccountInfo } from '../types/account';
import { WalletConnectSigner } from './WcSigner';
import { createClient } from 'polkadot-api';
import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat';
import { getWsProvider } from 'polkadot-api/ws-provider/web';
import { dot } from '@polkadot-api/descriptors';

export function convertDotToPlanck(value: bigint): bigint {
	return value * 10000000000n;
}

export function convertPlanckToDot(value: number | bigint): number {
	//TODO: deal with case with decimals.
	if (typeof value === 'bigint') {
		return Number(value / BigInt(10000000000));
	}
	return value / 10000000000;
}

// export async function getApi() {
// 	// const apiFromStore = get(api) as unknown as ApiRx | undefined;
// 	//
// 	// if (apiFromStore) {
// 	// 	return apiFromStore;
// 	// }
// 	// const wsProvider = new WsProvider(get(nodeEndpoint));
// 	// const apiNew = await firstValueFrom(ApiRx.create({ provider: wsProvider }));
// 	// api.set(apiNew);
// 	// return apiNew;
// 	const client = createClient(
// 		// Polkadot-SDK Nodes have issues, we recommend adding this enhancer
// 		// see Requirements page for more info
// 		withPolkadotSdkCompat(getWsProvider(get(nodeEndpoint)))
// 	);
//
// 	const dotApi = client.getTypedApi(dot);
// 	api.set(dotApi);
// 	return dotApi;
// }

/**
 * Performs a dry run and submits the transaction if the dry run succeeds.
 *
 * In case of WalletConnect address, a blind signature request will be sent,
 * neither a `result` nor an `errorMessage` will be returned.
 */
export async function dryRunAndSubmitTransaction(
	api: ApiRx,
	transaction: SubmittableExtrinsic<'rxjs', ISubmittableResult>,
	account: AccountInfo
): Promise<{
	result?: ISubmittableResult;
	errorMessage?: string;
}> {
	if (account.source === SupportedSources.WalletConnect) {
		const provider = get(walletConnectProvider);
		const session = get(walletConnectSession);
		if (!provider || !session) {
			return {
				errorMessage: 'Failed to connect with WalletConnect'
			};
		}
		const signer = new WalletConnectSigner(provider.client, session);
		try {
			// In case of wallet connect, only send a signature request since the transaction
			// will be done through Multix.
			// Throwing an error will be fine since no valid signature will be returned.
			await firstValueFrom(transaction.signAsync(account.address, { signer }));
			return {};
		} catch {
			return {};
		}
	} else {
		const signer = (await web3FromSource(account.source)).signer;

		const signatureObservable = transaction.signAsync(account.address, { signer });
		const signedTransaction = await firstValueFrom(signatureObservable);

		try {
			const dryRunObservable = api.rpc.system.dryRun(signedTransaction.toHex());
			const dryRunSubmittableResult = await firstValueFrom(dryRunObservable);

			if (dryRunSubmittableResult.isErr) {
				const err = dryRunSubmittableResult.asErr;
				return {
					errorMessage: `DryRun Error: ${err.type} ${err.isInvalid ? err.asInvalid.toHuman() : err.asUnknown.toHuman()}`
				};
			} else {
				if (dryRunSubmittableResult.asOk.isErr) {
					if (dryRunSubmittableResult.asOk.asErr.isModule) {
						const { docs, method, section } = api.registry.findMetaError(
							dryRunSubmittableResult.asOk.asErr.asModule
						);
						const errorMsg = `DryRun Error: ${section}.${method}: ${docs}`;
						return { errorMessage: errorMsg };
					}
				}
			}
		} catch (e) {
			return { errorMessage: `DryRun failed, ${e}` };
		}
	}

	// Submit transaction after dry run passes.
	const observable = transaction.send();
	const submittableResult = await firstValueFrom(
		observable.pipe(
			filter((event) => {
				return event.isFinalized || event.isError;
			})
		)
	);

	if (submittableResult.dispatchError || submittableResult.isError) {
		if (submittableResult.dispatchError?.isModule) {
			const { docs, method, section } = api.registry.findMetaError(
				submittableResult.dispatchError.asModule
			);
			const errorMsg = `${section}.${method}: ${docs}`;
			return { result: submittableResult, errorMessage: errorMsg };
		} else {
			console.error(submittableResult.toHuman());
			return {
				result: submittableResult,
				errorMessage: `Something went wrong, ${submittableResult.dispatchError || ''}`
			};
		}
	}
	try {
		await fetchBountiesAndChildBounties();
	} catch (e) {
		console.error(e);
	}
	return { result: submittableResult };
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
