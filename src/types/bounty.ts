import type { ChildBounty } from './child-bounty';

export interface Bounty {
	id: number;
	description?: string;
	proposer: string;
	value: bigint;
	fee: bigint;
	curatorDeposit: bigint;
	bond: bigint;
	status: BountyStatus;
	childBounties: ChildBounty[];
}

export type BountyStatus =
	| 'Proposed'
	| 'Approved'
	| 'Funded'
	| { CuratorProposed: { curator: string } }
	| { Active: { curator: string; updateDue: string } }
	| { PendingPayout: { curator: string; beneficiary: string; unlockAt: string } };
