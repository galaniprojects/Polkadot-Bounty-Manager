import { GovernanceOrigin } from '@polkadot-api/descriptors';

export const treasuryTracks = [
	{
		origin: GovernanceOrigin.SmallSpender(),
		toString: () => 'Small Spender'
	},
	{
		origin: GovernanceOrigin.MediumSpender(),
		toString: () => 'Medium Spender'
	},
	{
		origin: GovernanceOrigin.BigSpender(),
		toString: () => 'Big Spender'
	}
];
