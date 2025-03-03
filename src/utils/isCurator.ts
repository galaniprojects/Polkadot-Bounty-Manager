import { activeAccount } from '../stores';
import { get } from 'svelte/store';
import type { Bounty } from '../types/bounty';
import type { AccountInfo } from '../types/account';
import { getRelevantMultisig } from './getRelevantMultisig';
import type { ChildBounty } from '../types/child-bounty';

/**
 * Returns whether the given account is the curator of the given bounty or child bounty
 * directly or through a multisig.
 */
export function isCurator(bounty: Bounty | ChildBounty, account?: AccountInfo): boolean {
	account = account || get(activeAccount);
	if (!account) return false;

	return account.address === bounty.curator || !!getRelevantMultisig(bounty, account);
}
