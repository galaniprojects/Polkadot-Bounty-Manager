import SignClient from '@walletconnect/sign-client';
import type { SessionTypes } from '@walletconnect/types';
import type { PolkadotSigner } from 'polkadot-api';
import { get } from 'svelte/store';
import { activeAccount } from '../stores';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';

export const POLKADOT_CHAIN_ID = 'polkadot:91b171bb158e2d3848fa23a9f1c25182';

export class WalletConnectSigner implements PolkadotSigner {
	id = 1;
	session: SessionTypes.Struct;
	client: SignClient;

	constructor(client: SignClient, session: SessionTypes.Struct) {
		this.client = client;
		this.session = session;
	}
	publicKey: Uint8Array = decodeAddress(get(activeAccount)!.address)


		 // decodeAddress(address, false, 0);
	signTx = async (
		callData: Uint8Array,
		_signedExtensions: Record<
			string,
			{ identifier: string; value: Uint8Array; additionalSigned: Uint8Array }
		>,
		_metadata: Uint8Array,
		_atBlockNumber: number,
		_hasher?: (data: Uint8Array) => Uint8Array
	): Promise<Uint8Array> => {
		return this.signBytes(callData);
	};

	signBytes = async (data: Uint8Array): Promise<Uint8Array> => {
		console.log(">>>>>>>>>.signbytes")
		const request = {
			topic: this.session.topic,
			chainId: POLKADOT_CHAIN_ID,
			request: {
				id: this.id,
				method: 'polkadot_signTransaction',
				params: { address: get(activeAccount)!.address, transactionPayload: data }
			}
		};

		await this.client.request(request);
		this.id = this.id + 1;
		return new Uint8Array();
	};
}
