import { writable } from 'svelte/store';
import type { treasuryTracks } from '../../components/bounty-setup/treasuryTracks';

export interface BountyInfo {
	id: number;
	description: string;
	value?: bigint;
	track?: typeof treasuryTracks[number];
}

export const bountyInfo = writable<BountyInfo | undefined>();
