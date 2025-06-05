import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat';
import { getWsProvider, WsEvent } from 'polkadot-api/ws-provider/web';
import { type people, type kusamaPeople } from '@polkadot-api/descriptors';
import { createClient } from 'polkadot-api';

const dotEndpoints = [
	'wss://polkadot-people-rpc.polkadot.io',
	'wss://sys.ibp.network/people-polkadot',
	'wss://people-polkadot.dotters.network',
	'wss://rpc-people-polkadot.luckyfriday.io',
	'wss://people-polkadot.public.curie.radiumblock.co'
];

async function dotDescriptorsGetter() {
	return (await import('@polkadot-api/descriptors')).people as typeof people | typeof kusamaPeople;
}

export async function createPeopleTypedApi(
	endpoints = dotEndpoints,
	descriptorsGetter = dotDescriptorsGetter
) {
	const sdkProvider = withPolkadotSdkCompat(
		getWsProvider({
			endpoints,
			timeout: 5000,
			onStatusChanged(event) {
				if (event.type !== WsEvent.CONNECTED) return;
				console.log(`Connected People to ${event.uri}`);
			}
		})
	);
	const sdkClient = createClient(sdkProvider);
	const descriptors = await descriptorsGetter();
	return sdkClient.getTypedApi(descriptors);
}
