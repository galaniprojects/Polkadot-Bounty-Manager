import type { ChildBounty } from './child-bounty';
import { type ApiType } from '../utils/createTypedApi';

export type BountyRaw = Awaited<
	ReturnType<ApiType['query']['Bounties']['Bounties']['getEntries']>
>[number]['value'];

export interface Bounty {
	id: number;
	description?: string;
	beneficiary?: string;
	proposer: string;
	value: bigint;
	fee: bigint;
	curatorDeposit: bigint;
	bond: bigint;
	status: 'Proposed' | 'Approved' | 'Funded' | 'CuratorProposed' | 'Active' | 'PendingPayout';
	childBounties: ChildBounty[];
	curator: string | undefined;
	expiryDate?: Date | undefined;
}
