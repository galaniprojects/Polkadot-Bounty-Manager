import { get } from 'svelte/store';
import type { Bounty } from '../../../types/bounty';
import { isCurator } from '../../../utils/isCurator';
import { activeAccount } from '../../../stores';

export function getBountyCuratorError(bountyId: number, bounties: Bounty[], bounty?: Bounty) {
	if (bounties.length === 0) return;

	if (Number.isNaN(bountyId)) {
		return 'Bounty ID not provided';
	}
	if (!bounty) {
		return `Cannot find active bounty #${bountyId}`;
	}
	if (!bounty.curator) {
		return `The bounty "#${bounty.id} ${bounty.description ?? ''}" doesn’t have a curator yet`;
	}
	if (!isCurator(bounty, get(activeAccount))) {
		return `Connect with account ${bounty.curator} to manage the bounty "#${bounty.id} ${bounty.description ?? ''}"`;
	}
}
