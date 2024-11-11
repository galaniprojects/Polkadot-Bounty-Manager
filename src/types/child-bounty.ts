export interface ChildBountyRaw {
	value: string;
	fee: string;
	curatorDeposit: string;
	parentBounty: string;
	status: ChildBountyStatusRaw;
}

export interface ChildBounty {
	id: number;
	parentBounty: number;
	value: bigint;
	fee: bigint;
	curatorDeposit: bigint;
	statusRaw: ChildBountyStatusRaw;
	status: ChildBountyStatus;
	description?: string;
	curator?: string;
	beneficiary?: string;
	unlockAt?: string;
	dateOfPayout?: string;
}

export type ChildBountyStatusRaw =
	| 'Added'
	| { CuratorProposed: { curator: string } }
	| { Active: { curator: string } }
	| { PendingPayout: { curator: string; beneficiary: string; unlockAt: string } };

export enum ChildBountyStatus {
	Added = 'added',
	Active = 'active',
	SubCuratorProposed = 'sub-curator proposed',
	PendingPayout = 'pending payout'
}
