<script lang="ts">
	import { activeAccount, showAllCuratorOptions } from '../../stores';
	import { type Bounty } from '../../types/bounty';
	import AcceptCuratorRole from './operations/AcceptCuratorRole.svelte';
	import ClaimBounty from './operations/ClaimBounty.svelte';
	import ExtendBounty from './operations/ExtendBounty.svelte';

	export let bounty: Bounty;

	let extendBountyDialogOpen = false;
	let acceptCuratorRoleDialogOpen = false;
	let claimBountyDialogOpen = false;
</script>

<section class="flex flex-col space-y-1 px-3 pt-5 lg:justify-end lg:mr-12 lg:space-y-3 2xl:pr-36">
	{#if false}
		<div class="flex flex-col space-y-1 lg:flex-row lg:space-x-3 lg:justify-end">
			<p class="pt-2 text-sm text-white">
				<span class="lg:hidden">Add</span> Beneficiary Claim Form
			</p>
			<button
				class="w-full h-12 button-popup font-bold rounded-md lg:w-fit lg:h-auto lg:pt-1 lg:min-w-32"
			>
				<span class="lg:hidden">BENEFICIARY CLAIM FORM</span>
				<span class="hidden lg:inline-flex">ADD</span>
			</button>
		</div>
	{/if}

	{#if $showAllCuratorOptions || ['Proposed', 'Approved', 'Funded'].includes(bounty.status)}
		<div class="flex flex-col space-y-1 lg:flex-row lg:space-x-3 lg:justify-end">
			<p class="pt-2 text-sm text-white">Curator Role</p>

			<a
				class="link-button w-full h-12 button-popup font-bold rounded-md lg:w-fit lg:h-auto lg:pt-1 lg:max-w-32 lg:px-7"
				href={`/bounty-setup/curator-proposal?bounty-id=${bounty.id}`}
			>
				PROPOSE
			</a>
		</div>
	{/if}

	{#if $showAllCuratorOptions || (bounty.status === 'CuratorProposed' && bounty.curator === $activeAccount?.address)}
		<div class="flex flex-col space-y-1 lg:flex-row lg:space-x-3 lg:justify-end">
			<p class="pt-2 text-sm text-white">Curator Role</p>
			<button
				class="w-full h-12 button-popup font-bold rounded-md lg:w-fit lg:h-auto lg:pt-1 lg:max-w-32 lg:px-9"
				on:click={() => {
					acceptCuratorRoleDialogOpen = true;
				}}
			>
				ACCEPT
			</button>
		</div>
	{/if}

	{#if $showAllCuratorOptions || (bounty.status === 'Active' && bounty.curator === $activeAccount?.address)}
		<div class="flex flex-col space-y-1 lg:flex-row lg:space-x-3 lg:justify-end">
			<p class="pt-2 text-sm text-white">Extend Bounty</p>
			<button
				class="w-full h-12 px-10 bg-extendButtonBackground text-white font-bold rounded-md lg:w-fit lg:h-auto lg:pt-1 lg:max-w-32 lg:px-9"
				on:click={() => {
					extendBountyDialogOpen = true;
				}}
			>
				EXTEND
			</button>
		</div>
	{/if}

	{#if $showAllCuratorOptions || bounty.status === 'PendingPayout'}
		<div class="flex flex-col space-y-1 lg:flex-row lg:space-x-3 lg:justify-end">
			<button
				on:click={() => (claimBountyDialogOpen = true)}
				class="w-full h-12 button-popup font-bold rounded-md lg:w-fit lg:h-auto lg:pt-1 lg:max-w-32 lg:px-10"
			>
				CLAIM
			</button>
		</div>
	{/if}
</section>

{#if acceptCuratorRoleDialogOpen}
	<AcceptCuratorRole bind:open={acceptCuratorRoleDialogOpen} {bounty} />
{/if}
{#if extendBountyDialogOpen}
	<ExtendBounty bind:open={extendBountyDialogOpen} {bounty} />
{/if}
{#if claimBountyDialogOpen}
	<ClaimBounty bind:open={claimBountyDialogOpen} {bounty} />
{/if}
