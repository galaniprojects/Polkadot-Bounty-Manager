export interface ChildBounty {
	id: number;
	parentBounty: number;
	value: bigint;
	fee: bigint;
	curatorDeposit: bigint;
	status: ChildBountyStatus;
	description?: string;
}

export type ChildBountyStatus =
	| 'Added'
	| { CuratorProposed: { curator: string } }
	| { Active: { curator: string } }
	| { PendingPayout: { curator: string; beneficiary: string; unlockAt: string } };
