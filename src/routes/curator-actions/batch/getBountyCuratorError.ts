import type { Bounty } from '../../../types/bounty';

export function getBountyCuratorError(
	bountyId: number,
	bounties: Bounty[],
	bounty?: Bounty,
	curator?: string
) {
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
	if (bounty.curator !== curator) {
		return `Connect with account ${bounty.curator} to manage the bounty "#${bounty.id} ${bounty.description ?? ''}"`;
	}
}
