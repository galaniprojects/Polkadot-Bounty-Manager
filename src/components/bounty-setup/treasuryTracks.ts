import { GovernanceOrigin } from '@polkadot-api/descriptors';

export const treasuryTracks = [
	{
		origin: GovernanceOrigin.SmallSpender(),
		toString: () => {
			return 'Small Spender';
		}
	},
	{
		origin: GovernanceOrigin.MediumSpender(),
		toString: () => {
			return 'Medium Spender';
		}
	},
	{
		origin: GovernanceOrigin.BigSpender(),
		toString: () => {
			return 'Big Spender';
		}
	}
];
