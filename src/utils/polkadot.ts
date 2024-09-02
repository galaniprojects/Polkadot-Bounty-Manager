import { ApiRx } from '@polkadot/api';
import type { Signer, SubmittableExtrinsic } from '@polkadot/api/types';
import type { ISubmittableResult } from '@polkadot/types/types';
import { firstValueFrom, filter } from 'rxjs';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';

export function convertDotToPlanck(value: bigint) {
	return value * 10000000000n;
}

export function convertPlanckToDot(value: number) {
	return value / 10000000000;
}

/**
 * Performs a dry run and submits the transaction if the dry run succeeds.
 *
 * @returns an error or a result. If `errorMessage` is `undefined`,
 * `result` will be defined.
 */
export async function dryRunAndSubmitTransaction(
	api: ApiRx,
	transaction: SubmittableExtrinsic<'rxjs', ISubmittableResult>,
	address: string,
	signer: Signer
): Promise<{
	result?: ISubmittableResult;
	errorMessage?: string;
}> {
	try {
		// Dry run the transaction.
		const signatureObservable = transaction.signAsync(address, { signer });
		const signedTransaction = await firstValueFrom(signatureObservable);

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
			return { result: submittableResult, errorMessage: 'something went wrong' };
		}
	}
	return { result: submittableResult };
}

export function isValidAddress(address: string) {
	try {
		const decoded = decodeAddress(address, false, 0);
		const reEncoded = encodeAddress(decoded, 0);

		return reEncoded === address;
	} catch (error) {
		return false;
	}
}
