import type { ChildBounty } from './child-bounty';
import { type ApiType } from '../utils/createTypedApi';

export type BountyRaw = Awaited<
	ReturnType<ApiType['query']['Bounties']['Bounties']['getEntries']>
>[number]['value'];

export const bountyStatuses = [
	'Proposed',
	'Approved',
	'Funded',
	'CuratorProposed',
	'Active',
	'PendingPayout',
	'Claimed',
	'Canceled',
	'Rejected'
] as const;

export interface Bounty {
	id: number;
	description?: string;
	beneficiary?: string;
	proposer?: string;
	value: bigint;
	fee?: bigint;
	status: (typeof bountyStatuses)[number];
	childBounties: ChildBounty[];
	curator: string | undefined;
	curatorMultisigAccount?: string;
	updateDue?: number;
	expiryDate?: Date | undefined;
}

export const statusLabels = {
	Proposed: 'proposed',
	Approved: 'approved',
	Funded: 'funded',
	CuratorProposed: 'curatorProposed',
	Active: 'active',
	PendingPayout: 'pendingPayout',
	Claimed: 'claimed',
	Canceled: 'canceled',
	Rejected: 'rejected'
};
