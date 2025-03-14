import type { AccountInfo, MultisigInfo } from '../types/account';
import type { Bounty } from '../types/bounty';
import type { ChildBounty } from '../types/child-bounty';

export function getRelevantMultisig(
	{ curatorMultisigAccount }: Bounty | ChildBounty,
	account: AccountInfo
): MultisigInfo | undefined {
	const multisigs = account.multisigs?.filter(({ address }) => address === curatorMultisigAccount);
	if (multisigs?.length !== 1) {
		return undefined;
	}
	return multisigs[0];
}
