import { get } from 'svelte/store';
import { dotApi } from '../stores';

let api = get(dotApi);

export type ChildBountyRaw = Awaited<
	ReturnType<typeof api.query.ChildBounties.ChildBounties.getEntries>
>[0]['value'];

export interface ChildBounty {
	id: number;
	parentBounty: number;
	value: bigint;
	fee: bigint;
	curatorDeposit: bigint;
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
