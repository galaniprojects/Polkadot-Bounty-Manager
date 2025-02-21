import type { ChildBounty } from './child-bounty';
import { type ApiType } from '../utils/createTypedApi';

export type BountyRaw = Awaited<
	ReturnType<ApiType['query']['Bounties']['Bounties']['getEntries']>
>[number]['value'];

export interface Bounty {
	id: number;
	description?: string;
	beneficiary?: string;
	proposer?: string;
	value: bigint;
	fee?: bigint;
	status:
		| 'Proposed'
		| 'Approved'
		| 'Funded'
		| 'CuratorProposed'
		| 'Active'
		| 'PendingPayout'
		| 'Claimed'
		| 'Canceled'
		| 'Rejected';
	childBounties: ChildBounty[];
	curator: string | undefined;
	updateDue?: number;
	expiryDate?: Date | undefined;
}
