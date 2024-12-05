import { writable } from 'svelte/store';

export interface BountyInfo {
	id: number;
	description: string;
	value?: bigint;
}

export const bountyInfo = writable<BountyInfo | undefined>();
