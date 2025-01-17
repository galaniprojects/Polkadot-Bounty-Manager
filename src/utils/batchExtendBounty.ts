import { get } from 'svelte/store';
import { Binary } from 'polkadot-api';
import { dotApi } from '../stores';
import type { AnyTransaction } from './transaction';
import { formatDate } from './common';

export function batchExtendBounty(parent: number | undefined | false, transaction: AnyTransaction) {
	if (parent === undefined || parent === false) {
		return transaction;
	}

	const api = get(dotApi);

	const extend = api.tx.Bounties.extend_bounty_expiry({
		bounty_id: parent,
		remark: new Binary(new Uint8Array())
	});

	return api.tx.Utility.batch_all({
		calls: [extend.decodedCall, transaction.decodedCall]
	});
}

const extensionDays = 90;

export function extendedExpiry() {
	const extended = new Date();
	extended.setDate(extended.getDate() + extensionDays);
	return formatDate(extended);
}
