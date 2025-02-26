import { get } from 'svelte/store';
import { dotApi } from '../../stores';
import type { MultisigInfo } from '../../types/account';

export async function fetchCuratorProxyAddress(accountId: string) {
	const api = get(dotApi);
	const proxy = await api.query.Proxy.Proxies.getValue(accountId);

	try {
		return proxy[0][0].delegate;
	} catch {
		return undefined;
	}
}

type GraphQLResponse = {
	data: {
		multisigAddress: {
			signatories: string[];
		} | null;
	};
};

type MultisigAccountResponse = {
	data: {
		multisigAddresses: {
			multisigAddresses: MultisigInfo[];
		};
	};
};

export async function fetchMultisigSignatories(curatorAddress: string): Promise<string[]> {
	const graphqlEndpoint = 'https://statescan.rilt.kilt.io/graphql';

	try {
		const proxyAddress = await fetchCuratorProxyAddress(curatorAddress);

		if(!proxyAddress){
			return []
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
export async function fetchMultisigAccount(signatory: string): Promise<MultisigInfo[]> {
	const graphqlEndpoint = 'https://statescan.rilt.kilt.io/graphql';
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
				total
				offset
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
