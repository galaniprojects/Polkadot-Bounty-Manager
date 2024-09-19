export interface Bounty {
	id: number;
	description?: string;
	proposer: string;
	value: bigint;
	fee: bigint;
	curatorDeposit: bigint;
	bond: bigint;
	status: BountyStatus;
}

export type BountyStatus =
	| 'Proposed'
	| 'Approved'
	| 'Funded'
	| { CuratorProposed: { curator: string } }
	| { Active: { updateDue: string } }
	| { PendingPayout: { curator: string; beneficiary: string; unlockAt: string } };
