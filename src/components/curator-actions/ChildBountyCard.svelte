<script lang="ts">
	import LogoPolkassembly from '../svg/LogoPolkassembly.svelte';
	import LogoSubscan from '../svg/LogoSubscan.svelte';
	import LogoTreasuryIcon from '../svg/LogoTreasuryIcon.svelte';

	export let id: string | number = '';
	export let title: string = '';
	export let status: Status;
	export let value: string = '';
	export let curatorFee: string = '';
	// optional
	export let subCurator: string = '';
	export let beneficiary: string = '';
	export let dateCreated: string = '';
	export let dateOfPayout: string = '';
	export let timeUntilPayout: string = '';
	export let isExpandable: boolean = true;
	export let onAssign: () => void = () => {};

	type Status = 'created' | 'active' | 'awarded' | 'claimed' | 'sub-curator proposed';

	function getStatusClass(status: string): string {
		switch (status) {
			case 'created':
				return 'bg-childBountyHeaderGray';
			case 'sub-curator proposed':
				return 'bg-childBountyHeaderGray';
			case 'active':
				return 'bg-childBountyHeaderOrange';
			case 'awarded':
				return 'bg-childBountyHeaderGreen';
			case 'claimed':
				return 'bg-childBountyHeaderGreen';
			default:
				return 'bg-childBountyHeader';
		}
	}

	function getButtonText(status: Status): string {
		switch (status) {
			case 'created':
				return 'ASSIGN';
			case 'sub-curator proposed':
				return 'ACCEPT';
			case 'active':
				return 'AWARD';
			case 'awarded':
				return 'CLAIM';
			case 'claimed':
				return '';
			default:
				return '';
		}
	}
</script>

<div class="bg-white pb-3 lg:w-[960px] xl:w-[1250px] 2xl:w-[1280px]">

	<!-- Header Section -->
	<div
		class="flex justify-between text-white pl-6 pr-1 pt-1 min-h-6 {getStatusClass(
			status
		)}"
	>
		<div class="flex items-start">
			<div class="flex flex-col w-60">
				<span class="text-sm">#{id} {title}</span>
			</div>
			<div class="flex flex-col w-72">
				{#if dateCreated}
					<p class="text-xs">Created: {dateCreated}</p>
				{/if}
			</div>
			<div class="flex flex-col w-[480px]">
				{#if dateOfPayout}
					<p class="text-xs">Date of payout: {dateOfPayout}</p>
				{/if}
			</div>
		</div>
		<div class="flex space-x-6 items-center">
			<span class="status text-xs">{status}</span>
			{#if isExpandable}
				<button class="material-symbols-outlined">expand_more</button>
			{/if}
		</div>
	</div>

	<!-- Child Bounty Card Content -->
	<div class="flex justify-between pr-11 pt-1 pl-4">
		<div class="mt-3 px-3 flex items-start">
			<!-- Left column -->
			<div class="flex flex-col w-60">
				<section>
					<p class="text-xs">Value</p>
					<p class="text-sm">{value}</p>
				</section>
				<section class="text-xs mt-3">
					<p>Description</p>
					<p>
						This is a child bounty whose proposer address is shown in on-chain info…
					</p>
				</section>
			</div>

			<!-- Middle column -->
			<div class="flex flex-col w-72">
				<section>
					<p class="text-xs">Sub-Curator</p>
					<p class="sub-curator text-sm">{subCurator}</p>
				</section>
				{#if beneficiary}
					<section class="mt-3">
						<p class="text-xs">Beneficiary</p>
						<p class="beneficiary text-sm">{beneficiary}</p>
					</section>
				{/if}
			</div>

			<div class="flex flex-col">
				<section>
					<p class="text-xs">Sub-curator Fee</p>
					<p class="text-sm">{curatorFee} DOT</p>
				</section>
			</div>
		</div>
		<!-- Right column  -->
		<div class="items-top">
			<div class="flex justify-between space-x-4">
				{#if status === 'created'}
					<p class="mt-4">Sub-curator</p>
				{/if}
				<div class="grid space-y-4">
					{#if getButtonText(status) !== ''}
						<div class="mt-3">
							<button
								on:click={onAssign}
								class="{getStatusClass(status)} text-white rounded-md font-bold py-1 min-w-32"
							>
								{getButtonText(status)}
							</button>
						</div>
					{/if}
					{#if status === 'created' || status === 'sub-curator proposed' || status === 'active'}
						<button class="bg-${getStatusClass(status)} border close-button rounded-md font-bold py-1 min-w-32">
							CLOSE
						</button>
					{/if}
				</div>
				<div class="flex gap-2 mt-3">
					<button class="w-6 h-6"><LogoTreasuryIcon /></button>
					<button class="w-6 h-6"><LogoPolkassembly /></button>
					<button class="w-6 h-6"><LogoSubscan /></button>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.status {
		font-family: 'Overpass Italic';
	}
</style>
