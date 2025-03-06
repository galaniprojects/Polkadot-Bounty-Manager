import { get } from 'svelte/store';
import { dotApi, proxies } from '../../stores';
import type { MultisigInfo } from '../../types/account';
import { currentBlockchain } from '../app-bar/blockchains';

export async function fetchAllProxies() {
	const api = get(dotApi);

	const fetchedProxies = await api.query.Proxy.Proxies.getEntries();

	const proxyMap = new Map<string, string>();

	fetchedProxies.forEach(({ keyArgs: [address], value: [value] }) => {
		// Only consider proxies that have a single entry and that entry is of type 'Any'.
		if (value.length === 1 && value[0].proxy_type.type === 'Any') {
			proxyMap.set(address, value[0].delegate);
		}
	});

	proxies.set(proxyMap);
	return proxyMap;
}

type GraphQLResponse = {
	data: {
		multisigAddress: {
			signatories: string[];
		} | null;
	};
};

interface MultisigAccountResponse {
	data: {
		multisigAddresses: {
			multisigAddresses: MultisigInfo[];
		};
	};
}

export async function fetchMultisigSignatories(curatorAddress: string): Promise<string[]> {
	const graphqlEndpoint = get(currentBlockchain).baseUrls.stateScanGraphqlApi;
	if (!graphqlEndpoint) {
		return [];
	}

	try {
		const proxyAddress = get(proxies)?.get(curatorAddress);

		if (!proxyAddress) {
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
			throw new Error('Error fetching signatories');
		}

		const data = (await response.json()) as GraphQLResponse;

		return data.data.multisigAddress?.signatories || [];
	} catch (error) {
		console.error('Error fetching signatories', error);
		return [];
	}
}

/**
 * Fetches multisig accounts that the signatory is part of.
 *
 * @param signatory signatory address.
 * @returns array of multisig accounts that the signatory is part of, an empty array in case of error.
 */
export async function fetchMultisigInfo(signatory: string): Promise<MultisigInfo[]> {
	const graphqlEndpoint = get(currentBlockchain).baseUrls.stateScanGraphqlApi;
	if (!graphqlEndpoint) {
		return [];
	}

	try {
		const query = `
      query {
			  multisigAddresses(
				  signatory: "${signatory}" 
				  offset: 0
				  limit: 1000
			  ) {
				  multisigAddresses {
				    threshold
				    signatories
				    address
				  }
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
			throw new Error('Error fetching signatories');
		}

		const data = (await response.json()) as MultisigAccountResponse;
		return data.data.multisigAddresses.multisigAddresses;
	} catch (error) {
		console.error('Error fetching multisig info', error);
		return [];
	}
}
