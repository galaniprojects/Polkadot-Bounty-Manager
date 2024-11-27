<script lang="ts">
	import { type Bounty } from '../../types/bounty';
	import ExternalLinks from './ExternalLinks.svelte';
	import DOMPurify from 'dompurify';
	import BountyDescription from './BountyDescription.svelte';
	import CopyableAddress from '../common/CopyableAddress.svelte';
	import { formatDate } from '../../utils/common';
	import { formatPlanckToDot } from '../../utils/polkadot';

	export let bounty: Bounty;
	export let description: string | undefined;
	export let remainingBalance: string | undefined;

	let detailsExpanded = false;

	function handleMoreDetailsToggleClick() {
		detailsExpanded = !detailsExpanded;
	}
</script>

<div class="bg-curatorCarousel xl:pt-6 text-white w-full p-0 sm:p-3">
	<!-- Desktop design -->
	<div class="hidden lg:flex lg:flex-col gap-3 justify-start lg:ml-7">
		<section class="flex flex-col lg:flex lg:flex-row lg:justify-between">
			<section class="flex flex-col lg:flex-row">
				{#if remainingBalance}
					<div class="lg:w-[250px]">
						<p class="text-xs">Remaining Balance</p>
						<p class="text-2xl"><span>{remainingBalance}</span> DOT</p>
					</div>
				{/if}
				<div class="lg:w-40 xl:w-44">
					<p class="text-xs">Value</p>
					<p class="text-md"><span>{formatPlanckToDot(bounty.value)}</span> DOT</p>
				</div>

				<div class="mt-4 lg:mt-0 lg:w-40 xl:w-44">
					<p class="text-xs">Curator Fee</p>
					<p class="text-md"><span>{formatPlanckToDot(bounty.fee)}</span> DOT</p>
				</div>
				{#if bounty.beneficiary}
					<div class="mt-4 lg:mt-0">
						<p class="text-xs">Beneficiary</p>
						<CopyableAddress address={bounty.beneficiary} />
					</div>
				{/if}
			</section>
			<div class="flex justify-center lg:mr-12 2xl:mr-44">
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
					{#if bounty.expiryDate != undefined}
						<section class="flex-col text-start">
							<p class="text-xs">Expiration date</p>
							<p>{formatDate(bounty.expiryDate)}</p>
						</section>
					{/if}
					{#if bounty.curator}
						<div class="mt-4 lg:mt-0">
							<p class="text-xs">Curator</p>
							<CopyableAddress address={bounty.curator} />
						</div>
					{/if}
				</div>
				<!--  -->
			</section>
		</section>
	</div>

	<!-- Mobile design -->
	<div class="lg:hidden">
		<div class="grid space-y-5 bg-curatorCarousel px-[10px] py-5 text-white">
			{#if remainingBalance}
				<div class="lg:w-[250px] xl:w-[490px]">
					<p class="text-xs">Remaining Balance</p>
					<p class="text-2xl"><span>{remainingBalance}</span> DOT</p>
				</div>
			{:else}
				<div>
					<p class="text-xs">Value</p>
					<p class="text-2xl"><span>{formatPlanckToDot(bounty.value)}</span> DOT</p>
				</div>
			{/if}
		</div>
		<div class="flex justify-center items-center text-white">
			{#if !detailsExpanded}
				<div class="bg-curatorCarousel max-w-fit rounded-b-md max-h-[24px]">
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
			<div class="bg-curatorCarousel text-white px-[10px] pb-6 space-y-5">
				{#if remainingBalance}
					<div>
						<p class="text-xs">Value</p>
						<p class="text-md"><span>{formatPlanckToDot(bounty.value)}</span> DOT</p>
					</div>
				{/if}
				<div class="space-y-1">
					<p class="text-xs">Curator Fee</p>
					<p class="text-md"><span>{formatPlanckToDot(bounty.fee)}</span> DOT</p>
				</div>
				{#if bounty.curator}
					<div class="space-y-1">
						<p class="text-xs">Curator</p>
						<CopyableAddress address={bounty.curator} />
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
				<div class="flex justify-center items-center">
					<ExternalLinks dimension={10} bountyId={bounty.id} />
				</div>
			</div>
			<div class="flex justify-center items-center">
				<div class="text-white bg-curatorCarousel max-w-fit rounded-b-md max-h-[24px]">
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
