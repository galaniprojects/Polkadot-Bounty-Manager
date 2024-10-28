<script lang="ts">
	import { goto } from '$app/navigation';
	import { activeAccount, showAllCuratorOptions } from '../../stores';
	import type { Bounty } from '../../types/bounty';
	import AcceptCuratorRule from './AcceptCuratorRole.svelte';
	import AwardBounty from './AwardBounty.svelte';
	import type { BountyStatus } from './BountyCard.svelte';
	import ExtendBounty from './ExtendBounty.svelte';

	export let bounty: Bounty;
	export let curator: string | undefined;
	export let status: BountyStatus;

	let extendBountyDialogOpen = false;
	let acceptCuratorRuleDialogOpen = false;
	let awardBountyDialogOpen = false;
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

	{#if $showAllCuratorOptions || status === 'proposed' || status === 'approved' || status === 'funded'}
		<div class="flex flex-col space-y-1 lg:flex-row lg:space-x-3 lg:justify-end">
			<p class="pt-2 text-sm text-white">Curator Role</p>

			<button
				class="w-full h-12 button-popup font-bold rounded-md lg:w-fit lg:h-auto lg:pt-1 lg:max-w-32 lg:px-7"
				on:click={() => {
					goto(`/bounty-setup?step=curator-proposal&bounty-id=${bounty.id}`);
				}}
				>PROPOSE
			</button>
		</div>
	{/if}

	{#if $showAllCuratorOptions || (status === 'curator proposed' && $activeAccount && curator === $activeAccount.address)}
		<div class="flex flex-col space-y-1 lg:flex-row lg:space-x-3 lg:justify-end">
			<p class="pt-2 text-sm text-white">Curator Role</p>
			<button
				class="w-full h-12 button-popup font-bold rounded-md lg:w-fit lg:h-auto lg:pt-1 lg:max-w-32 lg:px-9"
				on:click={() => {
					acceptCuratorRuleDialogOpen = true;
				}}>ACCEPT</button
			>
		</div>
	{/if}

	<!-- Add logic/functionality -->
	<div class="flex flex-col space-y-1 lg:flex-row lg:space-x-3 lg:justify-end">
		<p class="pt-2 text-sm text-white">Extend Bounty</p>
		<button
			class="w-full h-12 px-10 bg-extendButtonBackground text-white font-bold rounded-md lg:w-fit lg:h-auto lg:pt-1 lg:max-w-32 lg:px-9"
			on:click={() => {
				extendBountyDialogOpen = true;
			}}>EXTEND</button
		>
	</div>
</section>

{#if acceptCuratorRuleDialogOpen}
	<AcceptCuratorRule bind:open={acceptCuratorRuleDialogOpen} {bounty} />
{/if}
{#if awardBountyDialogOpen}
	<AwardBounty bind:open={awardBountyDialogOpen} {bounty} />
{/if}
{#if extendBountyDialogOpen}
	<ExtendBounty bind:open={extendBountyDialogOpen} {bounty} />
{/if}
