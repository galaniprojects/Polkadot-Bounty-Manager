import type { ChildBounty } from './child-bounty';
import { get } from 'svelte/store';
import { dotApi } from '../stores';

let api = get(dotApi);

export type BountyRaw = Awaited<
	ReturnType<typeof api.query.Bounties.Bounties.getEntries>
>[0]['value'];

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
