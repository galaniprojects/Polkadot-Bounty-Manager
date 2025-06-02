import { get } from 'svelte/store';
import { currentBlockchain } from '../components/app-bar/blockchains';
import { dotApi } from '../stores';
import { parse } from 'marked';

export async function getRemainingBalanceAndDescription(
	bountyId: number
): Promise<{ remainingBalance: bigint; description: string | undefined } | undefined> {
	const { subSquareApi } = get(currentBlockchain).baseUrls;
	if (!subSquareApi) {
		return;
	}
	try {
		const url = `${subSquareApi}/treasury/bounties/${bountyId}`;
		const response = await fetch(url);

		if (!response.ok) throw new Error('Failed to fetch bounty details.');

		const data = (await response.json()) as { onchainData: { address: string }; content: string };

		try {
			const description = await parse(data.content);
			const fundsAddress = data.onchainData.address;
			const account = await get(dotApi).query.System.Account.getValue(fundsAddress);
			return { remainingBalance: account.data.free, description };
		} catch {
			console.error('Error fetching remaining balance.');
		}
	} catch {
		console.error('Error fetching remaining balance.');
	}
}
