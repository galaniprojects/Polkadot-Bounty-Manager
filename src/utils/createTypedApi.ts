import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat';
import { getWsProvider, WsEvent } from 'polkadot-api/ws-provider/web';
import { dot } from '@polkadot-api/descriptors';
import { createClient } from 'polkadot-api';

export function createTypedApi(endpoints: string[]) {
	const sdkProvider = withPolkadotSdkCompat(
		getWsProvider({
			endpoints,
			timeout: 5000,
			onStatusChanged(event) {
				if (event.type !== WsEvent.CONNECTED) return;
				console.log(`Connected to ${event.uri}`);
			}
		})
	);
	const sdkClient = createClient(sdkProvider);
	return sdkClient.getTypedApi(dot);
}
