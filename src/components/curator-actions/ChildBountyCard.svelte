<script lang="ts">
	export let id: string | number = '';
	export let title: string = '';
	export let status: string = '';
	export let value: string = '';
	export let curatorFee: string = '';
	// optional
	export let subCurator: string = '';
	export let beneficiary: string = '';
	export let dateCreated: string = '';
	export let dateOfPayout: string = '';
	export let timeUntilPayout: string = '';
	export let showAssignButton: boolean = true;
	export let isExpandable: boolean = true;
	export let onAssign: () => void = () => {};
</script>

<div class="bg-white pb-3">
	<!-- Child Bounty Card Header -->
	<div class="flex justify-between items-center bg-childBountyHeader pl-2 pr-1 min-h-6">
		<span class="text-sm text-white min-w-fit">#{id} {title}</span>
		<span class="status bg-childBountyStatus text-white px-2 py-1 text-xs min-w-fit">{status}</span>
		{#if isExpandable}
			<button class="material-symbols-outlined text-white">expand_more</button>
		{/if}
	</div>

	<!-- Child Bounty Card Content -->
	<div class="mt-3 px-3">
		<div class="flex justify-between items-top auto-rows-auto">
			<div class="grid gap-3">
				<section>
					<p class="text-xs">Value</p>
					<p class="text-sm">{value} DOT</p>
				</section>
				<section>
					<p class="text-xs">Sub-Curator</p>
					<p class="sub-curator text-sm">{subCurator}</p>
				</section>
				{#if dateCreated}
					<section>
						<p class="text-xs">Date created</p>
						<p class="text-sm">{dateCreated}</p>
					</section>
				{/if}
			</div>

			<div class="grid gap-2">
				<section>
					<p class="text-xs">Curator Fee</p>
					<p class="text-sm">{curatorFee} DOT</p>
				</section>

				{#if beneficiary}
					<section>
						<p class="text-xs">Beneficiary</p>
						<p class="beneficiary text-sm">{beneficiary}</p>
					</section>
				{/if}

				{#if dateOfPayout}
					<section>
						<p class="text-xs">Date of payout</p>
						<p class="text-sm">{dateOfPayout}</p>
					</section>
				{/if}
			</div>
		</div>
		{#if timeUntilPayout}
			<section class="mt-3">
				<p class="text-xs">Time until payout</p>
				<p class="text-sm">{timeUntilPayout}</p>
			</section>
		{/if}
	</div>
	<div class="flex justify-between">
		<div class="flex justify-start mt-3">
			<button
				class="material-symbols-outlined flex justify-center items-center text-darkgray border-darkgray border-2 rounded-full p-3 w-9 h-9 text-2xl ml-3"
			>
				bookmark_remove
			</button>
			<button
				class="material-symbols-outlined flex justify-center items-center text-darkgray border-darkgray border-2 rounded-full p-3 w-9 h-9 text-2xl ml-3"
			>
				delete
			</button>
		</div>
		{#if showAssignButton}
			<button on:click={onAssign} class="bg-accent text-white rounded-md font-bold py-2 px-8 mr-3"
				>ASSIGN</button
			>
		{/if}
	</div>
</div>

<style>
	.sub-curator,
	.beneficiary {
		font-family: 'PT Mono';
	}
	.status {
		font-family: 'Overpass Italic';
	}
</style>
