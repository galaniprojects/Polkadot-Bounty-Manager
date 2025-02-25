import { get } from 'svelte/store';
import { currentBlockchain } from '../components/app-bar/blockchains';
import { fetchAllWithPagination } from './fetchAllWithPagination';
import type { ChildBounty, childBountyStatuses } from '../types/child-bounty';
import type { Bounty } from '../types/bounty';
import { keyBy } from './keyBy';

interface DoTreasuryChildBounty {
	state: {
		state: (typeof childBountyStatuses)[number];
	};
	parentBountyId: number;
	index: number;
	description: string;
	value: number;
	fee: number | null;
	dValue: {
		$numberDecimal: string;
	};
	curator: string;
	beneficiary: string;
	unlockAt: number;
}

interface DoTreasuryBounty {
	bountyIndex: number;
	title: string;
	beneficiary?: string;
	dValue: string;
	state: {
		state: Bounty['status'];
	};
	childBounties: DoTreasuryChildBounty[];
	curator?: string;
	updateDue: number;
}

function parseChildBounty(input: DoTreasuryChildBounty) {
	return <ChildBounty>{
		id: input.index,
		parentBounty: input.parentBountyId,
		value: BigInt(input.value),
		description: input.description,
		status: input.state.state,
		fee: input.fee !== null ? BigInt(input.fee) : 0n,
		curatorDeposit:
			input.dValue.$numberDecimal !== 'NaN' ? BigInt(input.dValue.$numberDecimal) : 0n,
		curator: input.curator,
		beneficiary: input.beneficiary,
		...(input.state.state === 'PendingPayout' && {
			unlockAt: input.unlockAt
		})
	};
}

function parseBounty(input: DoTreasuryBounty) {
	return <Bounty>{
		id: input.bountyIndex,
		description: input.title,
		beneficiary: input.beneficiary,
		value: BigInt(input.dValue),
		status: input.state.state,
		childBounties: input.childBounties.map(parseChildBounty),
		curator: input.curator,
		...(input.updateDue && {
			updateDue: input.updateDue
		})
	};
}

/** Some bounties are not delivered by blockchain nodes and can only be fetched from indexers like doTreasury.
 * This function modifies existing list because it also needs to modify childBounties property. */
export async function addBountiesFromDoTreasury(bounties: Bounty[]) {
	const { doTreasuryApi } = get(currentBlockchain).baseUrls;
	if (!doTreasuryApi) return;

	const url = new URL(`${doTreasuryApi}/bounties`);
	const rawBounties = await fetchAllWithPagination<DoTreasuryBounty>(url, 20);
	const doTreasuryBounties = rawBounties.map(parseBounty);

	const childBounties = bounties.flatMap(({ childBounties }) => childBounties);
	const doTreasuryChildBounties = doTreasuryBounties.flatMap(({ childBounties }) => childBounties);

	const bountiesMap = keyBy(bounties, 'id');
	const childBountiesMap = keyBy(childBounties, 'id');

	// merge parent bounties
	const missingBounties = doTreasuryBounties.filter(({ id }) => !(id in bountiesMap));
	bounties.push(...missingBounties);

	// merge child bounties
	const missingChildBounties = doTreasuryChildBounties.filter(
		({ id }) => !(id in childBountiesMap)
	);
	bounties.forEach(({ id, childBounties }) => {
		childBounties.push(...missingChildBounties.filter(({ parentBounty }) => id === parentBounty));
	});
}
