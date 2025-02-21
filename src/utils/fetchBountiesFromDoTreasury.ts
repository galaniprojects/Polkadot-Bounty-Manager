import { fetchPaginated } from './fetchPaginated';
import type { ChildBounty, childBountyStatuses } from '../types/child-bounty';
import type { Bounty } from '../types/bounty';

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

const bountiesApi = 'https://polkadot-api.dotreasury.com/bounties';

export async function fetchBountiesFromDoTreasury() {
	// TODO: skip for Paseo
	const rawBounties = await fetchPaginated<DoTreasuryBounty>(new URL(bountiesApi), 20);
	return rawBounties.map(parseBounty);
}
