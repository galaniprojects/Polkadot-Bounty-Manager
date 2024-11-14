import { bounties, dotApi } from '../stores';
import { hideLoadingDialog, showErrorDialog, showLoadingDialog } from './loading-screen';
import type { Bounty, BountyRaw } from '../types/bounty';
import { firstValueFrom } from 'rxjs';
import { parseBounty, parseChildBounty } from './common';
import type { ChildBounty, ChildBountyRaw } from '../types/child-bounty';
import { SetActiveAccountBounties } from './bounties';
import { get } from 'svelte/store';

export async function fetchBountiesAndChildBounties(showProgress = true) {
	if (showProgress) {
		showLoadingDialog('Loading...');
	}
	let api = get(dotApi);
	try {
		const parsedBounties = await fetchBountiesAndDescription();
		// Query child bounties.
		const childBounties: ChildBounty[] = [];

		let unparsedChildBounties = await api.query.ChildBounties.ChildBounties.getEntries();

		for (const childBounty of unparsedChildBounties) {
			const id = childBounty.keyArgs[1];
			childBounties.push(await parseChildBounty(childBounty.value, id));
		}

		childBounties.sort((cb1, cb2) => {
			if (cb1.id > cb2.id) {
				return -1;
			} else {
				return 1;
			}
		});

		// Set parent bounty.
		for (let i = 0; i < parsedBounties.length; i++) {
			parsedBounties[i].childBounties = childBounties.filter((childBounty) => {
				return childBounty.parentBounty === parsedBounties[i].id;
			});
		}

		// Query child bounty description.
		let childBountiesDescriptions =
			await api.query.ChildBounties.ChildBountyDescriptions.getEntries();
		for (const desc of childBountiesDescriptions) {
			const index = desc.keyArgs[0];
			const description = desc.value.asText();
			const childBounty = childBounties.find((childBounty) => childBounty.id == index);
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

	let api = get(dotApi);
	const unparsedBounties = await api.query.Bounties.Bounties.getEntries();
	// const unparsedBounties = await firstValueFrom(api.query.bounties.bounties.entries());
	for (const unparsedBounty of unparsedBounties) {
		const index = unparsedBounty.keyArgs[0];
		parsedBounties.push(await parseBounty(unparsedBounty.value, index));
	}

	parsedBounties.sort((bounty1, bounty2) => {
		if (bounty1.id > bounty2.id) {
			return -1;
		} else {
			return 1;
		}
	});

	// Query bounty description.
	const bountiesDescriptions = await api.query.Bounties.BountyDescriptions.getEntries();
	for (const desc of bountiesDescriptions) {
		const index = desc.keyArgs[0];
		const description = desc.value.asText();
		const bounty = parsedBounties.find((bounty) => bounty.id == index);
		if (bounty) {
			bounty.description = description;
		}
	}
	return parsedBounties;
}
