import { GovernanceOrigin } from '@polkadot-api/descriptors';
import { get } from 'svelte/store';
import { dotApi } from '../../stores';

async function getDepositByName(trackName: string) {
	const tracks = await get(dotApi).constants.Referenda.Tracks();
	const found = tracks.find(([, { name }]) => name === trackName);
	if (!found) throw new Error(`Track with name "${trackName}" not found`);
	return found[1].decision_deposit;
}

export const treasuryTracks = [
	{
		origin: GovernanceOrigin.SmallSpender(),
		label: 'Small Spender',
		depositGetter: () => getDepositByName('small_spender')
	},
	{
		origin: GovernanceOrigin.MediumSpender(),
		label: 'Medium Spender',
		depositGetter: () => getDepositByName('medium_spender')
	},
	{
		origin: GovernanceOrigin.BigSpender(),
		label: 'Big Spender',
		depositGetter: () => getDepositByName('big_spender')
	}
];
