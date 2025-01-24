import { blockChainMeta, dotApi } from '../stores';

export async function initializeApi(endpoints: string[]) {
	const { createTypedApi } = await import('./createTypedApi');
	const { client, api } = createTypedApi(endpoints);

	const compatibilityToken = await api.compatibilityToken;
	const ss58Format = api.constants.System.SS58Prefix(compatibilityToken);

	const chainSpecData = await client.getChainSpecData();
	const {
		properties: { tokenDecimals, tokenSymbol }
	} = chainSpecData as {
		properties: {
			tokenDecimals: number[];
			tokenSymbol: string[];
		};
	};

	const symbol = Array.isArray(tokenSymbol) ? tokenSymbol[0] : tokenSymbol;
	const decimals = Array.isArray(tokenDecimals) ? tokenDecimals[0] : tokenDecimals;
	const multiplier = 10n ** BigInt(decimals);

	blockChainMeta.set({ ss58Format, decimals, multiplier, symbol });
	dotApi.set(api);
}
