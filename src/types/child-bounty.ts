import { type createTypedApi } from '../utils/createTypedApi';

export type ChildBountyRaw = Awaited<
	ReturnType<
		Awaited<
			ReturnType<typeof createTypedApi>['query']['ChildBounties']['ChildBounties']['getEntries']
		>
	>
>[number]['value'];

export const childBountyStatuses = ['Added', 'Active', 'CuratorProposed', 'PendingPayout'] as const;

export interface ChildBounty {
	id: number;
	parentBounty: number;
	value: bigint;
	fee: bigint;
	curatorDeposit: bigint;
	status: (typeof childBountyStatuses)[number];
	description?: string;
	curator?: string;
	beneficiary?: string;
	unlockAt?: string;
	dateOfPayout?: string;
}

export const statusLabels = {
	Added: 'added',
	CuratorProposed: 'sub-curator proposed',
	Active: 'active',
	PendingPayout: 'pending payout'
};
