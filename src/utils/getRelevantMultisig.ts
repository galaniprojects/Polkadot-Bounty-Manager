import type { AccountInfo, MultisigInfo } from '../types/account';
import type { Bounty } from '../types/bounty';
import type { ChildBounty } from '../types/child-bounty';

export function getRelevantMultisig(
	bounty: Bounty | ChildBounty,
	account: AccountInfo | undefined
): MultisigInfo | undefined {
	if (!account) {
		return undefined;
	}
	const multisigs = account.multisigs?.filter(
		(multisig) => multisig.address === bounty.curatorMultisigAccount
	);
	if (multisigs?.length !== 1) {
		return undefined;
	}
	return multisigs[0];
}
