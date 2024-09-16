import type { SignerPayloadJSON, SignerResult } from '@polkadot/types/types';
import type { HexString } from '@polkadot/util/types';
import SignClient from '@walletconnect/sign-client';
import type { SessionTypes } from '@walletconnect/types';

export const POLKADOT_CHAIN_ID = 'polkadot:91b171bb158e2d3848fa23a9f1c25182';
export const WALLET_CONNECT_SOURCE = 'WalletConnect';

export class WalletConnectSigner {
	id = 1;
	session: SessionTypes.Struct;
	client: SignClient;

	constructor(client: SignClient, session: SessionTypes.Struct) {
		this.client = client;
		this.session = session;
	}

	signPayload = async (payload: SignerPayloadJSON): Promise<SignerResult> => {
		const request = {
			topic: this.session.topic,
			chainId: POLKADOT_CHAIN_ID,
			request: {
				id: this.id,
				method: 'polkadot_signTransaction',
				params: { address: payload.address, transactionPayload: payload }
			}
		};

		const { signature } = (await this.client.request(request)) as {
			signature: HexString;
		};
		this.id = this.id + 1;
		return { id: this.id, signature };
	};
}
