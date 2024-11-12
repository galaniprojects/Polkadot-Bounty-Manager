import type { ChildBounty } from './child-bounty';

export interface BountyRaw {
	proposer: string;
	value: string;
	fee: string;
	curatorDeposit: string;
	bond: string;
	status: BountyStatusRaw;
}

export interface Bounty {
	id: number;
	description?: string;
	proposer: string;
	value: bigint;
	fee: bigint;
	curatorDeposit: bigint;
	bond: bigint;
	statusRaw: BountyStatusRaw;
	status: BountyStatus;
	childBounties: ChildBounty[];
	curator: string | undefined;
	expiryDate: Date | undefined;
}

export type BountyStatusRaw =
	| 'Proposed'
	| 'Approved'
	| 'Funded'
	| { CuratorProposed: { curator: string } }
	| { Active: { curator: string; updateDue: string } }
	| { PendingPayout: { curator: string; beneficiary: string; unlockAt: string } };

export enum BountyStatus {
	Proposed = 'proposed',
	Approved = 'approved',
	Funded = 'funded',
	CuratorProposed = 'curator proposed',
	Active = 'active',
	PendingPayout = 'pending payout'
}
