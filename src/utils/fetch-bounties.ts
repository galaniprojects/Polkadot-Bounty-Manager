import { bounties as bountiesStore, dotApi } from '../stores';
import { hideLoadingDialog, showErrorDialog, showLoadingDialog } from './loading-screen';
import type { Bounty } from '../types/bounty';
import { parseBounty, parseChildBounty, setActiveAccountBounties } from './bounties';
import { get } from 'svelte/store';

function keyBy<Value extends object>(list: Value[], field: keyof Value) {
	return Object.fromEntries(list.map((value) => [value[field], value] as [keyof Value, Value]));
}

/**
 * Fetches all bounties, child bounties and their descriptions, sorts them,
 * and sets them in the store under `bounties`.
 * Also updates the ActiveAccountBounties.
 */
export async function fetchBountiesAndChildBounties(showProgress = true) {
	try {
		if (showProgress) {
			showLoadingDialog('Loading...');
		}
		const api = get(dotApi);
		await api.query.System.BlockWeight.getValue(); // somehow makes the next query work
		const currentBlock = await api.query.System.Number.getValue();

		const rawBounties = await api.query.Bounties.Bounties.getEntries({ at: 'best' });
		const bounties = rawBounties
			.map(({ value, keyArgs: [id] }) => parseBounty(value, id, currentBlock))
			.sort((a, b) => (a.id > b.id ? -1 : 1));

		const bountiesMap = keyBy(bounties, 'id');
		const descriptions = await api.query.Bounties.BountyDescriptions.getEntries({ at: 'best' });
		descriptions.forEach(({ value, keyArgs: [id] }) => {
			if (id in bountiesMap) {
				bountiesMap[id].description = value.asText();
			}
		});

		const rawChildBounties = await api.query.ChildBounties.ChildBounties.getEntries({ at: 'best' });
		const childBounties = rawChildBounties
			.map(({ value, keyArgs: [, id] }) => parseChildBounty(value, id, currentBlock))
			.sort((a, b) => (a.id > b.id ? -1 : 1));

		const childBountiesMap = keyBy(childBounties, 'id');
		const childDescriptions = await api.query.ChildBounties.ChildBountyDescriptions.getEntries({
			at: 'best'
		});
		childDescriptions.forEach(({ value, keyArgs: [id] }) => {
			if (id in childBountiesMap) {
				childBountiesMap[id].description = value.asText();
			}
		});

		// Assign to parent bounty.
		bounties.forEach((bounty: Bounty) => {
			bounty.childBounties = childBounties.filter(({ parentBounty }) => parentBounty === bounty.id);
		});

		bountiesStore.set(bounties);
		setActiveAccountBounties();

		if (showProgress) {
			hideLoadingDialog();
		}
	} catch (e) {
		console.error(e);
		if (showProgress) {
			showErrorDialog('Error while loading bounty details');
		}
	}
}
