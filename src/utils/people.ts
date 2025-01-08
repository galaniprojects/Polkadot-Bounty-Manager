import { get, writable } from 'svelte/store';
import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat';
import { type Binary, createClient } from 'polkadot-api';
import { people } from '@polkadot-api/descriptors';
import { WsEvent } from '@polkadot-api/ws-provider/web';
import { getWsProvider } from 'polkadot-api/ws-provider/web';

const endpoints = [
	'wss://polkadot-people-rpc.polkadot.io',
	'wss://sys.ibp.network/people-polkadot',
	'wss://people-polkadot.dotters.network',
	'wss://rpc-people-polkadot.luckyfriday.io',
	'wss://people-polkadot.public.curie.radiumblock.co'
];

function createPeopleTypedApi() {
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
	return sdkClient.getTypedApi(people);
}

const peopleApi = writable(createPeopleTypedApi());

export async function getPeopleChainName(address: string | undefined) {
	if (!address) return address;

	const api = get(peopleApi);
	const result = await api.query.Identity.IdentityOf.getValue(address);
	if (!result) return address;

	const value = result[0].info.display.value as Binary | undefined;
	const text = value?.asText();

	return text || address;
}
