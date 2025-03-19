<script lang="ts">
	import { showAllCuratorOptions } from '../../stores';
	import { type Bounty } from '../../types/bounty';
	import { isCurator } from '../../utils/isCurator';
	import AcceptCuratorRole from './operations/AcceptCuratorRole.svelte';
	import ClaimBounty from './operations/ClaimBounty.svelte';
	import ExtendBounty from './operations/ExtendBounty.svelte';

	export let bounty: Bounty;

	let extendBountyDialog: HTMLDialogElement;
	let acceptCuratorRoleDialog: HTMLDialogElement;
	let claimBountyDialog: HTMLDialogElement;
</script>

{#if $showAllCuratorOptions || bounty.status === 'Funded'}
	<a
		class="bg-backgroundButtonDark text-white rounded-[10px] h-[40px] w-full md:w-1/2 text-center pt-2"
		href={`/bounty-setup/curator-proposal?bounty-id=${bounty.id}`}
	>
		PROPOSE CURATOR
	</a>
{/if}

<!-- {#if $showAllCuratorOptions || bounty.status === 'Proposed'}
	<a
		class="bg-backgroundButtonDark text-white rounded-[10px] h-[40px] w-full md:w-1/2 text-center pt-2"
		href={`/bounty-setup/approval?bounty-id=${bounty.id}`}
	>
		APPROVE BOUNTY
	</a>
{/if} -->

{#if $showAllCuratorOptions || (bounty.status === 'CuratorProposed' && isCurator(bounty))}
	<button
		class="bg-backgroundButtonDark text-white rounded-[10px] h-[40px] w-full md:w-1/2"
		on:click={() => {
			acceptCuratorRoleDialog.showModal();
		}}
	>
		ACCEPT CURATOR
	</button>
{/if}

{#if $showAllCuratorOptions || (bounty.status === 'Active' && isCurator(bounty))}
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
