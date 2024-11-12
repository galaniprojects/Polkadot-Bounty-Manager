import { bounties } from '../stores';
import { hideLoadingDialog, showErrorDialog, showLoadingDialog } from './loading-screen';
import { getApi } from './polkadot';
import type { Bounty, BountyRaw } from '../types/bounty';
import { firstValueFrom } from 'rxjs';
import { parseBounty, parseChildBounty } from './common';
import type { ChildBounty, ChildBountyRaw } from '../types/child-bounty';
import { SetActiveAccountBounties } from './bounties';

export async function fetchBountiesAndChildBounties(showProgress = true) {
	if (showProgress) {
		showLoadingDialog('Loading...');
	}
	try {
		const parsedBounties = await fetchBountiesAndDescription();

		const api = await getApi();

		// Query child bounties.
		const childBounties: ChildBounty[] = [];
		const unparsedChildBounties = await firstValueFrom(
			api.query.childBounties.childBounties.entries()
		);

		for (const childBounty of unparsedChildBounties) {
			const id = Number((childBounty[0].toHuman()! as string[])[1].replaceAll(',', ''));
			childBounties.push(
				await parseChildBounty(childBounty[1].toHuman() as unknown as ChildBountyRaw, id)
			);
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
		const childBountiesDescriptions = await firstValueFrom(
			api.query.childBounties.childBountyDescriptions.entries()
		);
		for (const desc of childBountiesDescriptions) {
			const index = Number((desc[0].toHuman()! as string[])[0].replaceAll(',', ''));
			const description = desc[1].toHuman() as string;
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
	const api = await getApi();
	const parsedBounties: Bounty[] = [];

	const unparsedBounties = await firstValueFrom(api.query.bounties.bounties.entries());
	for (const unparsedBounty of unparsedBounties) {
		const index = Number((unparsedBounty[0].toHuman()! as string[])[0].replaceAll(',', ''));
		parsedBounties.push(
			await parseBounty(unparsedBounty[1].toHuman() as unknown as BountyRaw, index)
		);
	}

	parsedBounties.sort((bounty1, bounty2) => {
		if (bounty1.id > bounty2.id) {
			return -1;
		} else {
			return 1;
		}
	});

	// Query bounty description.
	const bountiesDescriptions = await firstValueFrom(
		api.query.bounties.bountyDescriptions.entries()
	);
	for (const desc of bountiesDescriptions) {
		const index = Number((desc[0].toHuman()! as string[])[0].replaceAll(',', ''));
		const description = desc[1].toHuman() as string;
		const bounty = parsedBounties.find((bounty) => bounty.id == index);
		if (bounty) {
			bounty.description = description;
		}
	}
	return parsedBounties;
}
