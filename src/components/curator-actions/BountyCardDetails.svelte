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

	export let bounty: Bounty;
	export let description: string | undefined;
	export let remainingBalance: bigint | undefined;

	let curatorsDialog: HTMLDialogElement;
</script>

<div class="bg-backgroundBounty w-full px-3">
	<!-- Desktop design -->
	<div class="space-y-5">
		{#if remainingBalance}
			<div>
				<p class="text-xs">Remaining Balance</p>
				<p class="text-2xl"><Currency value={remainingBalance} /></p>
			</div>
		{/if}
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
		<div class="flex">
			{#if bounty.beneficiary}
				<div class="mt-4 lg:mt-0">
					<p class="text-xs">Beneficiary</p>
					<CopyableAddress address={bounty.beneficiary} />
				</div>
			{/if}
			{#if bounty.expiryDate}
				<section class="flex-col text-start">
					<p class="text-xs">Expiration date</p>
					<p>{formatDate(bounty.expiryDate)}</p>
				</section>
			{/if}
			{#if description}
				<div class="text-xs lg:w-[250px] xl:w-[490px]">
					<BountyDescription description={DOMPurify.sanitize(description)} />
				</div>
			{/if}
		</div>
	</div>
</div>

<Signatories bind:dialog={curatorsDialog} {bounty} curatorAddress={bounty.curator} />
