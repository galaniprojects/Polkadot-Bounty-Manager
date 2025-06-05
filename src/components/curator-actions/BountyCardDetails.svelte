<script lang="ts">
	import { type Bounty } from '../../types/bounty';
	import ExternalLinks from './ExternalLinks.svelte';
	import DOMPurify from 'dompurify';
	import BountyDescription from './BountyDescription.svelte';
	import CopyableAddress from '../common/CopyableAddress.svelte';
	import { formatDate } from '../../utils/common';
	import Currency from '../Currency.svelte';
	import Signatories from './Signatories.svelte';
	import BountyOperations from './BountyOperations.svelte';
	import { isCurator } from '../../utils/isCurator';
	import { activeAccount } from '../../stores';

	export let bounty: Bounty;
	export let description: string | undefined;
	export let remainingBalance: bigint | undefined;

	let curatorsDialog: HTMLDialogElement;
</script>

<div class="bg-backgroundBounty w-full px-3">
	<!-- Desktop design -->
	<div class="space-y-5">
		<div>
			<p class="text-xs">Remaining Balance</p>
			<p class="text-2xl">
				{#if remainingBalance}
					<Currency value={remainingBalance} />
				{:else}
					-
				{/if}
			</p>
		</div>

		<div class="flex flex-col space-y-[25px] sm:flex-row sm:space-x-[25px] sm:space-y-0">
			{#if bounty.curator}
				<button
					class="bg-backgroundButtonDark text-white rounded-[10px] h-[40px] w-full sm:w-1/2"
					on:click={() => {
						curatorsDialog.showModal();
					}}
				>
					SHOW CURATORS
				</button>
			{/if}

			<!-- Actions -->
			<BountyOperations {bounty} />
		</div>
		<div class="flex flex-col space-y-3 items-center sm:flex-row sm:justify-between">
			<div class="flex space-x-[110px]">
				<div>
					<p class="text-xs">Value</p>
					<p><Currency value={bounty.value} /></p>
				</div>
				{#if bounty.fee}
					<div>
						<p class="text-xs">Curator Fee</p>
						<p><Currency value={bounty.fee} /></p>
					</div>
				{/if}
			</div>
			<ExternalLinks dimension={10} bountyId={bounty.id} />
		</div>
		<div>
			{#if bounty.beneficiary}
				<div class="mt-4 lg:mt-0">
					<p class="text-xs">Beneficiary</p>
					<CopyableAddress address={bounty.beneficiary} />
				</div>
			{/if}
			{#if bounty.expiryDate}
				<section class="my-4 text-start">
					<p class="text-xs">Expiration date</p>
					<p>{formatDate(bounty.expiryDate)}</p>
				</section>
			{/if}
			{#if description && !isCurator(bounty, $activeAccount)}
				<section class="text-sm">
					<BountyDescription description={DOMPurify.sanitize(description)} />
				</section>
			{/if}
		</div>
	</div>
</div>

<Signatories bind:dialog={curatorsDialog} {bounty} />
