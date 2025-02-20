import type { ChildBounty, childBountyStatuses } from '../types/child-bounty';

interface DotreasuryChildBountyItem {
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
}

// const bountiesApi = 'https://polkadot-api.dotreasury.com/bounties';
const childBountiesApi = 'https://polkadot-api.dotreasury.com/child-bounties';

async function fetchPaginated<Item>(url: URL) {
	url.searchParams.set('page_size', '1000');

	let page = 0;
	let result: Item[] = [];

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	while (true) {
		url.searchParams.set('page', String(page));

		const response = await fetch(url);
		if (!response.ok) {
			console.error(response);
			throw new Error('Could not fetch child bounties');
		}

		const { items, pageSize } = (await response.json()) as { items: Item[]; pageSize: number };
		result = result.concat(items);

		if (items.length < pageSize) break;

		page++;
	}

	return result;
}

function parseChildBounty({
	beneficiary,
	curator,
	dValue,
	fee,
	index,
	parentBountyId,
	state,
	description,
	value
}: DotreasuryChildBountyItem) {
	return <ChildBounty>{
		id: index,
		parentBounty: parentBountyId,
		value: BigInt(value),
		fee: fee !== null ? BigInt(fee) : 0n,
		curatorDeposit: dValue.$numberDecimal !== 'NaN' ? BigInt(dValue.$numberDecimal) : 0n,
		status: state.state,
		description,
		curator,
		beneficiary
	};
}

export async function fetchChildBounties() {
	const bounties = await fetchPaginated<DotreasuryChildBountyItem>(new URL(childBountiesApi));

	return bounties.map(parseChildBounty);
}
