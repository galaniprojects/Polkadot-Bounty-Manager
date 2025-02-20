import { bounties as bountiesStore, dotApi } from '../stores';
import { hideLoadingDialog, showErrorDialog, showLoadingDialog } from './loading-screen';
import type { Bounty } from '../types/bounty';
import { calculateExpirationDate, formatDate } from './common';
import type { ChildBounty, childBountyStatuses } from '../types/child-bounty';
import { fetchPaginated } from './fetchPaginated';
import { setActiveAccountBounties } from './bounties';
import { get } from 'svelte/store';

function keyBy<Value extends object>(list: Value[], field: keyof Value) {
	return Object.fromEntries(list.map((value) => [value[field], value] as [keyof Value, Value]));
}

interface DotreasuryChildBounty {
	state: {
		state: (typeof childBountyStatuses)[number];
	};
	parentBountyId: number;
	index: number;
	description: string;
	value: number;
	fee: number | null;
	dValue: {
		$numberDecimal: string;
	};
	curator: string;
	beneficiary: string;
	unlockAt: number;
}

interface DotreasuryBounty {
	bountyIndex: number;
	title: string;
	beneficiary?: string;
	dValue: string;
	state: {
		state: Bounty['status'];
	};
	childBounties: DotreasuryChildBounty[];
	curator?: string;
	updateDue: number;
}

function parseChildBounty(input: DotreasuryChildBounty, currentBlock: number) {
	return <ChildBounty>{
		id: input.index,
		parentBounty: input.parentBountyId,
		value: BigInt(input.value),
		description: input.description,
		status: input.state.state,
		fee: input.fee !== null ? BigInt(input.fee) : 0n,
		curatorDeposit:
			input.dValue.$numberDecimal !== 'NaN' ? BigInt(input.dValue.$numberDecimal) : 0n,
		curator: input.curator,
		beneficiary: input.beneficiary,
		...(input.state.state === 'PendingPayout' && {
			dateOfPayout: formatDate(calculateExpirationDate(input.unlockAt, currentBlock))
		})
	};
}

function parseBounty(input: DotreasuryBounty, currentBlock: number) {
	return <Bounty>{
		id: input.bountyIndex,
		description: input.title,
		beneficiary: input.beneficiary,
		value: BigInt(input.dValue),
		status: input.state.state,
		childBounties: input.childBounties.map((item) => parseChildBounty(item, currentBlock)),
		curator: input.curator,
		...(input.updateDue && {
			expiryDate: calculateExpirationDate(input.updateDue, currentBlock)
		})
	};
}

const bountiesApi = 'https://polkadot-api.dotreasury.com/bounties';

/**
 * Fetches all bounties, child bounties and their descriptions, sorts them,
 * and sets them in the store under `bounties`.
 * Also updates the ActiveAccountBounties.
 */
export async function fetchBountiesAndChildBounties(showProgress = true) {
	try {
		if (showProgress) {
			showLoadingDialog('Loading...');
		}
		const api = get(dotApi);
		await api.query.System.BlockWeight.getValue(); // somehow makes the next query work
		const currentBlock = await api.query.System.Number.getValue();

		const rawBounties = await fetchPaginated<DotreasuryBounty>(new URL(bountiesApi), 20);
		const bounties = rawBounties.map((bounty) => parseBounty(bounty, currentBlock));
		bounties.sort((a, b) => (a.id > b.id ? -1 : 1));

		const bountiesMap = keyBy(bounties, 'id');
		const chainBounties = await api.query.Bounties.Bounties.getEntries();
		chainBounties.forEach(({ value, keyArgs: [id] }) => {
			if (!(id in bountiesMap)) return;
			bountiesMap[id].proposer = value.proposer;
			bountiesMap[id].fee = value.fee;
		});

		bountiesStore.set(bounties);
		setActiveAccountBounties();

		if (showProgress) {
			hideLoadingDialog();
		}
	} catch (e) {
		console.error(e);
		if (showProgress) {
			showErrorDialog('Error while loading bounty details');
		}
	}
}
