import type { Bounty } from '../types/bounty';
import { getRelevantMultisig } from './getRelevantMultisig';
import type { ChildBounty } from '../types/child-bounty';
import type { AccountInfo } from '../types/account';

/**
 * Returns whether the given account is the curator of the given bounty or child bounty
 * directly or through a multisig.
 */
export function isCurator(bounty: Bounty | ChildBounty, account: AccountInfo | undefined): boolean {
	if (!account) return false;

	return account.address === bounty.curator || !!getRelevantMultisig(bounty, account);
}
