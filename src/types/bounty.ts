import type { ChildBounty } from './child-bounty';
import { type createTypedApi } from '../utils/polkadot';

export type BountyRaw = Awaited<
	ReturnType<
		Awaited<ReturnType<typeof createTypedApi>['query']['Bounties']['Bounties']['getEntries']>
	>
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
	status: BountyStatus;
	childBounties: ChildBounty[];
	curator: string | undefined;
	expiryDate: Date | undefined;
}

export enum BountyStatus {
	Proposed = 'proposed',
	Approved = 'approved',
	Funded = 'funded',
	CuratorProposed = 'curator proposed',
	Active = 'active',
	PendingPayout = 'pending payout'
}

export type BountyInfo = {
	id?: number;
	description?: string;
	value?: bigint;
};
