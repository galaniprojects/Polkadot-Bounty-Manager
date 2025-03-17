import { get } from "svelte/store";
import { currentBlockchain } from "../components/app-bar/blockchains";
import { dotApi } from "../stores";

	export async function getRemainingBalance(bountyId: number): Promise<bigint | undefined> {
		try {
			const url = `${ get(currentBlockchain).baseUrls.subSquare}/api/treasury/bounties/${bountyId}`;
			const response = await fetch(url);
			if (!response.ok) throw new Error('Failed to fetch bounty details.');

			const data = (await response.json()) as { onchainData: { address: string } };

			// TODO: don't parse description for now.
			// import { parse } from 'marked';
			// 	description = await parse(data.content);
			try {
				const fundsAddress = data.onchainData.address;
				const account = await get(dotApi).query.System.Account.getValue(fundsAddress);
				return account.data.free;
			} catch {
				console.error('Error fetching remaining balance.');
			}
		} catch {
				console.error('Error fetching remaining balance.');
		}
	}