import type { ChildBounty, childBountyStatuses } from '../types/child-bounty';

export async function fetchOldCB(parentBountyId: number): Promise<ChildBounty[]> {
	const response = await fetchAllChildBounties(parentBountyId);
	return response.map((cbFromSubsquare) => {
		return {
			id: cbFromSubsquare.index,
			parentBounty: cbFromSubsquare.parentBounty,
			value: cbFromSubsquare.value,
			fee: cbFromSubsquare.fee,
			curatorDeposit: cbFromSubsquare.curatorDeposit,
			status: cbFromSubsquare.state,
			description: cbFromSubsquare.title,
			curator: cbFromSubsquare.curator,
			beneficiary: cbFromSubsquare.beneficiary
		};
	});
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

async function fetchAllChildBounties(parentBountyId: number) {
	const baseUrl = `https://polkadot.subsquare.io/api/treasury/child-bounties?parentBountyId=${parentBountyId}`;
	let page = 1;
	let totalItems: SubsquareChildBountyItem[] = [];

	let endPage = false;
	while (!endPage) {
		const response = await fetch(`${baseUrl}?page_size=100&page=${page}`);
		const data = (await response.json()) as SubsquareResponse;

		const filteredItems = data.items.filter(
			(item) => item.state === 'Canceled' || item.state === 'Claimed'
		);

		totalItems = totalItems.concat(filteredItems);
		if (data.items.length < data.pageSize) {
			endPage = true;
		}
		page++;
	}
	return totalItems;
}
