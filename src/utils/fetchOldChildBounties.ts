import type { ChildBounty, childBountyStatuses } from '../types/child-bounty';

export async function fetchOldCB(parentBountyId: number) {
	const items = await fetchAllChildBounties(parentBountyId);
	return items.map(
		({ beneficiary, curator, curatorDeposit, fee, index, parentBounty, state, title, value }) =>
			<ChildBounty>{
				id: index,
				parentBounty,
				value,
				fee,
				curatorDeposit,
				status: state,
				description: title,
				curator,
				beneficiary
			}
	);
}

interface SubsquareChildBountyItem {
	state: (typeof childBountyStatuses)[number];
	parentBounty: number;
	index: number;
	title: string;
	value: bigint;
	fee: bigint;
	curatorDeposit: bigint;
	curator: string;
	beneficiary: string;
}

interface SubsquareResponse {
	items: SubsquareChildBountyItem[];
	total: number;
	page: number;
	pageSize: number;
}

const childBountiesApi = 'https://polkadot.subsquare.io/api/treasury/child-bounties';

async function fetchAllChildBounties(parentBountyId: number) {
	const url = new URL(childBountiesApi);
	url.searchParams.set('parentBountyId', String(parentBountyId));
	url.searchParams.set('page_size', '100');

	let page = 1;
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

		const filteredItems = items.filter(({ state }) => ['Canceled', 'Claimed'].includes(state));
		totalItems = totalItems.concat(filteredItems);

		if (items.length < pageSize) {
			return totalItems;
		}
		page++;
	}
}
