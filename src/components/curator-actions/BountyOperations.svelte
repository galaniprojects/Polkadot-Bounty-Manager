<script lang="ts">
	import { activeAccount, showAllCuratorOptions } from '../../stores';
	import { type Bounty } from '../../types/bounty';
	import AcceptCuratorRole from './operations/AcceptCuratorRole.svelte';
	import ClaimBounty from './operations/ClaimBounty.svelte';
	import ExtendBounty from './operations/ExtendBounty.svelte';

	export let bounty: Bounty;

	let extendBountyDialog: HTMLDialogElement;
	let acceptCuratorRoleDialog: HTMLDialogElement;
	let claimBountyDialog: HTMLDialogElement;
</script>

{#if $showAllCuratorOptions || ['Proposed', 'Approved', 'Funded'].includes(bounty.status)}
	<a
		class="bg-backgroundButtonDark text-white rounded-[10px] h-[40px] w-full md:w-1/2 text-center pt-2"
		href={`/bounty-setup/curator-proposal?bounty-id=${bounty.id}`}
	>
		PROPOSE CURATOR
	</a>
{/if}

{#if $showAllCuratorOptions || (bounty.status === 'CuratorProposed' && bounty.curator === $activeAccount?.address)}
	<button
		class="bg-backgroundButtonDark text-white rounded-[10px] h-[40px] w-full md:w-1/2"
		on:click={() => {
			acceptCuratorRoleDialog.showModal();
		}}
	>
		ACCEPT CURATOR
	</button>
{/if}

{#if $showAllCuratorOptions || (bounty.status === 'Active' && bounty.curator === $activeAccount?.address)}
	<button
		class="bg-extendButtonBackground text-white rounded-[10px] h-[40px] w-full md:w-1/2"
		on:click={() => {
			extendBountyDialog.showModal();
		}}
	>
		EXTEND BOUNTY
	</button>
{/if}

{#if $showAllCuratorOptions || bounty.status === 'PendingPayout'}
	<button
		on:click={() => {
			claimBountyDialog.showModal();
		}}
		class="bg-backgroundButtonDark text-white rounded-[10px] h-[40px] w-full md:w-1/2"
	>
		CLAIM
	</button>
{/if}

<AcceptCuratorRole bind:dialog={acceptCuratorRoleDialog} {bounty} />
<ExtendBounty bind:dialog={extendBountyDialog} {bounty} />
<ClaimBounty bind:dialog={claimBountyDialog} {bounty} />
