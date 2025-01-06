import { GovernanceOrigin } from '@polkadot-api/descriptors';

export const treasuryTracks = [
	{
		origin: GovernanceOrigin.SmallSpender(),
		label: 'Small Spender'
	},
	{
		origin: GovernanceOrigin.MediumSpender(),
		label: 'Medium Spender'
	},
	{
		origin: GovernanceOrigin.BigSpender(),
		label: 'Big Spender'
	}
];
