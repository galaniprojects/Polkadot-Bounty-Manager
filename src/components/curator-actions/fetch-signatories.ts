import { get } from 'svelte/store';
import { dotApi } from '../../stores';

async function fetchCuratorProxyAddress(accountId: string) {
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
	const graphqlEndpoint = 'https://dot-gh-api.statescan.io/graphql';

	try {
		const proxyAddress = await fetchCuratorProxyAddress(curatorAddress);

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
			throw new Error("Error fetching signatories")
		}

		const data = (await response.json()) as GraphQLResponse;

		return data.data.multisigAddress?.signatories || [];
	} catch (error) {
		console.log('Error fetching signatories', error);
		return [];
	}
}
