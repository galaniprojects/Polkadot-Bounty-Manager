import { get } from 'svelte/store';
import { dotApi } from '../stores';
import type { ChildBounty, ChildBountyRaw } from '../types/child-bounty';
import type { Bounty, BountyRaw } from '../types/bounty';
import { keyBy } from './keyBy';

export function parseBounty(raw: BountyRaw, id: number) {
	const { fee, proposer, value } = raw;
	const { type } = raw.status;

	const curator = ['CuratorProposed', 'Active', 'PendingPayout'].includes(type)
		? raw.status.value?.curator
		: undefined;

	const result: Bounty = {
		id,
		proposer,
		value,
		fee,
		status: type,
		curator,
		childBounties: []
	};

	if (type === 'PendingPayout') {
		const { beneficiary } = raw.status.value;
		return { beneficiary, ...result };
	}

	if (type === 'Active' && 'update_due' in raw.status.value) {
		const updateDue = raw.status.value.update_due;
		return { updateDue, ...result };
	}

	return result;
}

export function parseChildBounty(raw: ChildBountyRaw, id: number) {
	const { fee, value, parent_bounty: parentBounty, curator_deposit: curatorDeposit } = raw;
	const { type } = raw.status;

	const curator = ['CuratorProposed', 'Active', 'PendingPayout'].includes(type)
		? raw.status.value?.curator
		: undefined;

	const result: ChildBounty = {
		id,
		value,
		fee,
		parentBounty,
		curatorDeposit,
		status: type,
		curator
	};

	if (type !== 'PendingPayout') {
		return result;
	}

	const { beneficiary, unlock_at: unlockAt } = raw.status.value;

	return {
		...result,
		unlockAt,
		beneficiary
	};
}

export async function fetchBountiesFromBlockchain() {
	const api = get(dotApi);

	const rawBounties = await api.query.Bounties.Bounties.getEntries();
	const bounties = rawBounties.map(({ value, keyArgs: [id] }) => parseBounty(value, id));

	const bountiesMap = keyBy(bounties, 'id');
	const descriptions = await api.query.Bounties.BountyDescriptions.getEntries();
	descriptions.forEach(({ value, keyArgs: [id] }) => {
		if (id in bountiesMap) {
			bountiesMap[id].description = value.asText();
		}
	});

	const rawChildBounties = await api.query.ChildBounties.ChildBounties.getEntries();
	const childBounties = rawChildBounties.map(({ value, keyArgs: [, id] }) =>
		parseChildBounty(value, id)
	);

	const childBountiesMap = keyBy(childBounties, 'id');
	const childDescriptions = await api.query.ChildBounties.ChildBountyDescriptions.getEntries();
	childDescriptions.forEach(({ value, keyArgs: [id] }) => {
		if (id in childBountiesMap) {
			childBountiesMap[id].description = value.asText();
		}
	});

	bounties.forEach((bounty) => {
		bounty.childBounties = childBounties.filter(({ parentBounty }) => parentBounty === bounty.id);
	});

	return bounties;
}
