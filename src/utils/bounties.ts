import { get } from 'svelte/store';
import { activeAccount, activeAccountBounties, bounties } from '../stores';
import { type Bounty } from '../types/bounty';
import { getRelevantMultisig } from './getRelevantMultisig';

/**
 * Sets the store's `activeAccountBounties` value to filtered bounties
 * that are related to the `activeAccount` account only.
 */
export function setActiveAccountBounties() {
	const allBounties: Bounty[] = get(bounties);
	const account = get(activeAccount);
	if (!account) {
		return;
	}
	const address = account.address;

	const filteredBounties: Bounty[] = [];
	for (const bounty of allBounties) {
		if (
			bounty.proposer === address ||
			bounty.curator === address ||
			getRelevantMultisig(bounty, account) !== undefined
		) {
			filteredBounties.push(bounty);
			continue;
		}
		const filteredChildBounties = bounty.childBounties.filter(({ curator }) => curator === address);
		if (filteredChildBounties.length > 0) {
			bounty.childBounties = filteredChildBounties;
			filteredBounties.push(bounty);
		}
	}
	activeAccountBounties.set(filteredBounties);
}
