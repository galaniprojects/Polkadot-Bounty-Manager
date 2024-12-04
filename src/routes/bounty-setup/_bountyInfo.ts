import { writable } from 'svelte/store';
import type { BountyInfo } from '../../types/bounty';

export const bountyInfo = writable<BountyInfo | undefined>();
