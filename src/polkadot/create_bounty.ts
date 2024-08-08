import { dot } from '$lib';
import { createClient } from 'polkadot-api';
import { getSmProvider } from 'polkadot-api/sm-provider';
import { chainSpec } from 'polkadot-api/chains/polkadot';
import { startFromWorker } from 'polkadot-api/smoldot/from-worker';
import SmWorker from 'polkadot-api/smoldot/worker?worker';

export async function createB() {
	const smoldot = startFromWorker(new SmWorker());
	const chain = await smoldot.addChain({ chainSpec });

	const { connectInjectedExtension, getInjectedExtensions } = await import(
		'polkadot-api/pjs-signer'
	);
	const extensions = getInjectedExtensions();
	console.log(extensions);
	const extension = await connectInjectedExtension("subwallet-js");
	const a = extension.getAccounts();
	console.log(a)

	// Connect to the polkadot relay chain.
	// const client = createClient(getSmProvider(chain));

	// To interact with the chain, you need to get the `TypedApi`, which includes
	// all the types for every call in that chain:
	//
	// const dotApi = client.getTypedApi(dot);
	// const num = await dotApi.query.Bounties.BountyCount.getValue();

	// console.log(num);

	// // get the value for an account
	// const accountInfo = await dotApi.query.System.Account.getValue(
	// 	'16JGzEsi8gcySKjpmxHVrkLTHdFHodRepEz8n244gNZpr9J'
	// );
	// console.log(accountInfo);
}
