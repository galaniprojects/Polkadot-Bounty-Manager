import type { Transaction, TxFinalizedPayload } from 'polkadot-api';
import { dot } from '@polkadot-api/descriptors';
import { createClient } from 'polkadot-api';
import { getWsProvider } from 'polkadot-api/ws-provider/web';
import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat';
import { get } from 'svelte/store';
import { injectedPolkadotAccount } from '../stores';

export async function test() { }
export async function submit(transaction: Transaction<any, any, any, any>) {

  let injectedAccount = get(injectedPolkadotAccount);
  if (!injectedAccount) {
    return;
  }

  let result: TxFinalizedPayload = await transaction.signAndSubmit(injectedAccount?.polkadotSigner);
}
