import { ApiRx } from '@polkadot/api';
import type { Signer, SubmittableExtrinsic } from '@polkadot/api/types';
import type { ISubmittableResult } from '@polkadot/types/types';
import { firstValueFrom, filter } from 'rxjs';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';

export function isInteger(input: string) {
	const num = parseInt(input, 10);
	return Number.isInteger(num) && num.toString() === input;
}

export function addDecimalsToDot(value: bigint) {
	return value * 10000000000n;
}

export async function dryRunAndSubmitTransaction(
	api: ApiRx,
	transaction: SubmittableExtrinsic<'rxjs', ISubmittableResult>,
	address: string,
	signer: Signer
): Promise<{
	result: ISubmittableResult;
	errorMessage?: string;
}> {
	// ToDo dry run the transaction first.

	// const observableDryRun = transaction.dryRun(address, {
	//   signer
	// });
	// const dryRunSubmittableResult = await firstValueFrom(observableDryRun);

	const observable = transaction.signAndSend(address, {
		signer: signer
	});

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
		console.log(decoded)
		const reEncoded = encodeAddress(decoded, 0);
		console.log(reEncoded)

		return reEncoded === address;
	} catch (error) {
		return false;
	}
}
