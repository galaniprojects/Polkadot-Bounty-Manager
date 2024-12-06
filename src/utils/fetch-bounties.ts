import { bounties, dotApi } from '../stores';
import { hideLoadingDialog, showErrorDialog, showLoadingDialog } from './loading-screen';
import type { Bounty } from '../types/bounty';
import { parseBounty, parseChildBounty } from './bounties';
import type { ChildBounty } from '../types/child-bounty';
import { SetActiveAccountBounties } from './bounties';
import { get } from 'svelte/store';

/**
 * Fetches all bounties, child bounties and their descriptions, sorts them,
 * and sets them in the store under `bounties`.
 * Also updates the ActiveAccountBounties.
 */
export async function fetchBountiesAndChildBounties(showProgress = true) {
	if (showProgress) {
		showLoadingDialog('Loading...');
	}
	const api = get(dotApi);
	try {
		const parsedBounties = await fetchBountiesAndDescription();
		// Query child bounties.
		const childBounties: ChildBounty[] = [];

		const unparsedChildBounties = await api.query.ChildBounties.ChildBounties.getEntries();

		for (const childBounty of unparsedChildBounties) {
			const id = childBounty.keyArgs[1];
			childBounties.push(await parseChildBounty(childBounty.value, id));
		}

		childBounties.sort((a, b) => (a.id > b.id ? -1 : 1));

		// Set parent bounty.
		for (let i = 0; i < parsedBounties.length; i++) {
			parsedBounties[i].childBounties = childBounties.filter(
				({ parentBounty }) => parentBounty === parsedBounties[i].id
			);
		}

		// Query child bounty description.
		const childBountiesDescriptions =
			await api.query.ChildBounties.ChildBountyDescriptions.getEntries();
		for (const desc of childBountiesDescriptions) {
			const index = desc.keyArgs[0];
			const description = desc.value.asText();
			const childBounty = childBounties.find(({ id }) => id === index);
			if (childBounty) {
				childBounty.description = description;
			}
		}

		bounties.set(parsedBounties);
		SetActiveAccountBounties();
	} catch (e) {
		console.error(e);
		if (showProgress) {
			showErrorDialog('Error while loading bounty details');
		}
	}

	if (showProgress) {
		hideLoadingDialog();
	}
}

async function fetchBountiesAndDescription(): Promise<Bounty[]> {
	const parsedBounties: Bounty[] = [];

	const api = get(dotApi);
	const unparsedBounties = await api.query.Bounties.Bounties.getEntries();
	for (const unparsedBounty of unparsedBounties) {
		const index = unparsedBounty.keyArgs[0];
		parsedBounties.push(await parseBounty(unparsedBounty.value, index));
	}

	parsedBounties.sort((a, b) => (a.id > b.id ? -1 : 1));

	// Query bounty description.
	const bountiesDescriptions = await api.query.Bounties.BountyDescriptions.getEntries();
	for (const desc of bountiesDescriptions) {
		const index = desc.keyArgs[0];
		const description = desc.value.asText();
		const bounty = parsedBounties.find(({ id }) => id === index);
		if (bounty) {
			bounty.description = description;
		}
	}
	return parsedBounties;
}
