import type { ChildBounty, childBountyStatuses } from '../types/child-bounty';

export async function fetchOldCB() {
	return [
		...(await fetchAllChildBounties('Claimed')),
		...(await fetchAllChildBounties('Canceled'))
	].map(
		({ beneficiary, curator, dValue, fee, index, parentBountyId, state, description, value }) =>
			<ChildBounty>{
				id: index,
				parentBounty: parentBountyId,
				value: BigInt(value),
				fee: fee !== null ? BigInt(fee) : 0n,
				curatorDeposit: dValue.$numberDecimal !== 'NaN' ? BigInt(dValue.$numberDecimal) : 0n,
				status: state.state,
				description,
				curator,
				beneficiary
			}
	);
}

interface SubsquareChildBountyItem {
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

interface SubsquareResponse {
	items: SubsquareChildBountyItem[];
	total: number;
	page: number;
	pageSize: number;
}

const childBountiesApi = 'https://polkadot-api.dotreasury.com/child-bounties';

async function fetchAllChildBounties(status: string) {
	const url = new URL(childBountiesApi);
	url.searchParams.set('status', status);
	url.searchParams.set('page_size', '1000');

	let page = 0;
	let totalItems: SubsquareChildBountyItem[] = [];

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	while (true) {
		url.searchParams.set('page', String(page));

		const response = await fetch(url);
		if (!response.ok) {
			console.error(response);
			throw new Error('Could not fetch child bounties');
		}

		const { items, pageSize } = (await response.json()) as SubsquareResponse;
		totalItems = totalItems.concat(items);

		if (items.length < pageSize) break;

		page++;
	}

	return totalItems;
}
