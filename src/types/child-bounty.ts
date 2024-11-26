import { type createTypedApi } from '../utils/polkadot';

export type ChildBountyRaw = Awaited<
	ReturnType<
		Awaited<
			ReturnType<typeof createTypedApi>['query']['ChildBounties']['ChildBounties']['getEntries']
		>
	>
>[number]['value'];

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

export enum ChildBountyStatus {
	Added = 'added',
	Active = 'active',
	SubCuratorProposed = 'sub-curator proposed',
	PendingPayout = 'pending payout'
}
