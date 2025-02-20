export async function fetchPaginated<Item>(url: URL, pageSize: number) {
	url.searchParams.set('page_size', String(pageSize));

	let page = 0;
	let result: Item[] = [];

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	while (true) {
		url.searchParams.set('page', String(page));

		const response = await fetch(url);
		if (!response.ok) {
			console.error(response);
			throw new Error('Could not fetch bounties');
		}

		const { items, pageSize } = (await response.json()) as { items: Item[]; pageSize: number };
		result = result.concat(items);

		if (items.length < pageSize) break;

		page++;
	}

	return result;
}
