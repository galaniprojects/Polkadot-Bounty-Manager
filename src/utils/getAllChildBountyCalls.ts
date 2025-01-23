import { get } from 'svelte/store';
import { Binary } from 'polkadot-api';
import { MultiAddress } from '@polkadot-api/descriptors';
import { dotApi } from '../stores';
import { convertFormattedDotToPlanck } from './polkadot';

export function getAllChildBountyCalls({
	parent_bounty_id,
	child_bounty_id,
	title,
	value,
	curator,
	beneficiary,
	fee
}: {
	parent_bounty_id: number;
	child_bounty_id: number;
	title: string;
	value: string;
	curator: string;
	beneficiary: string;
	fee: string;
}) {
	const $dotApi = get(dotApi);

	const add = $dotApi.tx.ChildBounties.add_child_bounty({
		parent_bounty_id,
		value: convertFormattedDotToPlanck(value),
		description: Binary.fromText(title)
	});

	const propose = $dotApi.tx.ChildBounties.propose_curator({
		parent_bounty_id,
		child_bounty_id,
		curator: MultiAddress.Id(curator),
		fee: convertFormattedDotToPlanck(fee)
	});

	const accept = $dotApi.tx.ChildBounties.accept_curator({
		parent_bounty_id,
		child_bounty_id
	});

	const award = $dotApi.tx.ChildBounties.award_child_bounty({
		parent_bounty_id,
		child_bounty_id,
		beneficiary: MultiAddress.Id(beneficiary)
	});

	const claim = $dotApi.tx.ChildBounties.claim_child_bounty({
		parent_bounty_id,
		child_bounty_id
	});

	return [add, propose, accept, award, claim].map(({ decodedCall }) => decodedCall);
}
