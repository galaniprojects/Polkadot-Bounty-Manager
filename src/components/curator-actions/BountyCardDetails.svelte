<script lang="ts">
	import { type Bounty } from '../../types/bounty';
	import ExternalLinks from './ExternalLinks.svelte';
	import DOMPurify from 'dompurify';
	import BountyDescription from './BountyDescription.svelte';
	import CopyableAddress from '../common/CopyableAddress.svelte';
	import { formatDate } from '../../utils/common';
	import Currency from '../Currency.svelte';
	import Signatories from './Signatories.svelte';

	export let bounty: Bounty;
	export let description: string | undefined;
	export let remainingBalance: bigint | undefined;

	let detailsExpanded = false;
	let curatorsDialogOpen = false;

	function handleMoreDetailsToggleClick() {
		detailsExpanded = !detailsExpanded;
	}
</script>

<div class="bg-backgroundBounty xl:pt-6 w-full p-0 sm:p-3">
	<!-- Desktop design -->
	<div class="hidden lg:flex lg:flex-col gap-3 lg:ml-7">
		<section class="flex flex-col lg:flex lg:flex-row lg:justify-between">
			<section class="flex flex-col lg:flex-row">
				{#if remainingBalance}
					<div class="lg:w-[250px]">
						<p class="text-xs">Remaining Balance</p>
						<p class="text-2xl"><Currency value={remainingBalance} /></p>
					</div>
				{/if}
				<div class="lg:w-40 xl:w-[250px]">
					<p class="text-xs">Value</p>
					<p class="text-md"><Currency value={bounty.value} /></p>
				</div>

				{#if bounty.fee}
					<div class="mt-4 lg:mt-0 lg:w-40 xl:w-44">
						<p class="text-xs">Curator Fee</p>
						<p class="text-md"><Currency value={bounty.fee} /></p>
					</div>
				{/if}

				{#if bounty.beneficiary}
					<div class="mt-4 lg:mt-0">
						<p class="text-xs">Beneficiary</p>
						<CopyableAddress address={bounty.beneficiary} />
					</div>
				{/if}
			</section>
			<div class="flex justify-center lg:mr-12 2xl:mr-[180px]">
				<ExternalLinks dimension={6} bountyId={bounty.id} />
			</div>
		</section>
		<section class="flex-col lg:flex lg:flex-row lg:justify-between">
			<section class="flex justify-start">
				{#if description}
					<div class="text-xs lg:w-[250px] xl:w-[490px] pr-12">
						<BountyDescription description={DOMPurify.sanitize(description)} />
					</div>
				{/if}
				<div class="flex justify-between lg:space-x-[160px] xl:space-x-40">
					{#if bounty.expiryDate}
						<section class="flex-col text-start">
							<p class="text-xs">Expiration date</p>
							<p>{formatDate(bounty.expiryDate)}</p>
						</section>
					{/if}
				</div>
			</section>
			{#if bounty.curator}
				<button
					class="flex justify-end lg:mr-[48px] 2xl:mr-[180px] bg-backgroundButtonDark text-white font-bold rounded-md lg:h-auto lg:pt-1 lg:max-w-32"
					on:click={() => {
						curatorsDialogOpen = true;
					}}
				>
					SHOW CURATORS
				</button>
			{/if}
		</section>
	</div>

	<!-- Mobile design -->
	<div class="lg:hidden">
		<div class="grid space-y-5 bg-backgroundBounty px-[10px] py-5">
			{#if remainingBalance}
				<div class="lg:w-[250px] xl:w-[490px]">
					<p class="text-xs">Remaining Balance</p>
					<p class="text-2xl"><Currency value={remainingBalance} /></p>
				</div>
			{:else}
				<div>
					<p class="text-xs">Value</p>
					<p class="text-2xl"><Currency value={bounty.value} /></p>
				</div>
			{/if}
		</div>
		<div class="flex justify-center items-center">
			{#if !detailsExpanded}
				<div class="bg-backgroundBounty max-w-fit rounded-b-md max-h-[24px]">
					<button class="text-xs align-top mt-1 ml-2" on:click={handleMoreDetailsToggleClick}>
						more details
					</button>
					<button
						class="material-symbols-outlined align-top w-6 h-6"
						on:click={handleMoreDetailsToggleClick}
					>
						keyboard_arrow_down
					</button>
				</div>
			{/if}
		</div>

		{#if detailsExpanded}
			<div class="bg-backgroundBounty px-[10px] pb-6 space-y-5">
				{#if remainingBalance}
					<div>
						<p class="text-xs">Value</p>
						<p class="text-md"><Currency value={bounty.value} /></p>
					</div>
				{/if}

				{#if bounty.fee}
					<div class="space-y-1">
						<p class="text-xs">Curator Fee</p>
						<p class="text-md"><Currency value={bounty.fee} /></p>
					</div>
				{/if}

				{#if description}
					<section class="text-xs space-y-1">
						<BountyDescription description={DOMPurify.sanitize(description)} />
					</section>
				{/if}
				<div class="flex justify-between">
					{#if bounty.expiryDate}
						<section class="flex-col text-start">
							<p class="text-xs">Expiration date</p>
							<p>{formatDate(bounty.expiryDate)}</p>
						</section>
					{/if}
				</div>
				{#if bounty.curator}
					<button
						class="w-full h-12 button-popup font-bold rounded-md"
						on:click={() => {
							curatorsDialogOpen = true;
						}}
					>
						SHOW CURATORS
					</button>
				{/if}
				<div class="flex justify-center items-center">
					<ExternalLinks dimension={10} bountyId={bounty.id} />
				</div>
			</div>
			<div class="flex justify-center items-center">
				<div class="bg-backgroundBounty max-w-fit rounded-b-md max-h-[24px]">
					<button class="text-xs align-top mt-1 ml-2" on:click={handleMoreDetailsToggleClick}>
						less details
					</button>
					<button
						class="material-symbols-outlined align-top w-6 h-6"
						on:click={handleMoreDetailsToggleClick}
					>
						keyboard_arrow_up
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<Signatories bind:open={curatorsDialogOpen} {bounty} curatorAddress={bounty.curator} />
