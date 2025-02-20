import { type ApiType } from '../utils/createTypedApi';

export type ChildBountyRaw = Awaited<
	ReturnType<ApiType['query']['ChildBounties']['ChildBounties']['getEntries']>
>[number]['value'];

export const childBountyStatuses = [
	'Added',
	'Active',
	'CuratorProposed',
	'PendingPayout',
	'Claimed',
	'Canceled'
] as const;

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
	dateOfPayout?: string;
}

export const statusLabels = {
	Added: 'added',
	CuratorProposed: 'sub-curator proposed',
	Active: 'active',
	PendingPayout: 'pending payout',
	Canceled: 'canceled',
	Claimed: 'claimed'
};
