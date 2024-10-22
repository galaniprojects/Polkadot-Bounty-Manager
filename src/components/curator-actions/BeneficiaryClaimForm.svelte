<script lang="ts">
	import type { Bounty } from '../../types/bounty';
	import BountyDialog from '../BountyDialog.svelte';

	export let open = false;
	export let bounty: Bounty;

	let fee = '-';
	let detailsExpanded = false;
	let urlBCF = '';

	function handleMoreDetailsToggleClick() {
		detailsExpanded = !detailsExpanded;
	}
</script>

<BountyDialog bind:open title="BENEFICIARY CLAIM FORM">
	<section class="space-y-10">
		<div class="space-x-1">
			<span>#{bounty.id}</span>
			{#if bounty.description !== undefined}
				<span>{bounty.description}</span>
			{/if}
		</div>

		<div class="text-sm">
			<p class="description-paragraph">
				This will write your communication form on the Blockchain as a remark and cost a small
				transaction fee. <br />
			</p>

			{#if detailsExpanded}
				<p>
					<br />It will then be fetched and displayed to other users as information for your bounty,
					by associating it with the Bounty ID and Curator Address. Using a remark is a way to store
					the URL in a decentralized way and avoid a database. <br />
					<br /> You will be able to update and change this link in the future, by repeating the action.
				</p>
			{/if}

			<div class="flex justify-center items-center mt-2">
				<button class="focus:outline-none" on:click={handleMoreDetailsToggleClick}>
					{#if detailsExpanded}
						less <span class="material-symbols-outlined">keyboard_arrow_up</span>
					{:else}
						more <span class="material-symbols-outlined">keyboard_arrow_down</span>
					{/if}
				</button>
			</div>
		</div>

		<div class="my-4">
			<input
				bind:value={urlBCF}
				class="border border-primary rounded-[3px] bg-white pl-2 pt-1 h-10 w-full text-primary"
				placeholder="enter URL"
			/>
		</div>

		<div>
			<p class="text-xs">Calculated Fee</p>
			<p>{fee}</p>
		</div>
	</section>

	<button
		disabled={!urlBCF}
		class="w-full md:w-fit mt-10 h-12 button-popup {urlBCF
			? 'button-popup'
			: 'opacity-50 cursor-not-allowed'}">SIGN</button
	>
</BountyDialog>
