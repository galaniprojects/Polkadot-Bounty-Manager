import { get } from 'svelte/store';
import { dotApi } from '../../stores';

async function fetchCuratorProxyAddress(accountId: string): Promise<string | undefined> {
	const api = get(dotApi);
	const proxy = await api.query.Proxy.Proxies.getValue(accountId);

	return proxy[0][0].delegate;
}

type GraphQLResponse = {
	data: {
		multisigAddress: {
			signatories: string[];
		} | null;
	};
};

export async function fetchMultisigSignatories(curatorAddress: string): Promise<string[]> {
	const graphqlEndpoint =
		'https://dot-gh-api.statescan.io/graphql?query=query+MyQuery+%7B%0A++multisigAddress%28account%3A+%2216JP2ichJCgTyxJAKADq1vUEz8sB265hwihvFiaUtpz4A2y6%22%29+%7B%0A++++signatories%0A++%7D%0A%7D';

	try {
		const proxyAddress = await fetchCuratorProxyAddress(curatorAddress);

		if (!proxyAddress) {
			console.error('No proxy address found for the given curator address');
			return [];
		}

		const query = `
        query {
            multisigAddress(account: "${proxyAddress}") {
                signatories
            }
        }`;

		const response = await fetch(graphqlEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ query })
		});

		if (!response.ok) {
			console.error('Failed to fetch related data for the given address.');
			return [];
		}

		const data = (await response.json()) as GraphQLResponse;

		return data.data.multisigAddress?.signatories || [];
	} catch (error) {
		console.log('Error fetching signatories', error);
		return [];
	}
}
