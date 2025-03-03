<script lang="ts">
	import { activeAccount, showAllCuratorOptions } from '../../stores';
	import { type Bounty } from '../../types/bounty';
	import { getRelevantMultisig } from '../../utils/getRelevantMultisig';
	import { isCurator } from '../../utils/isCurator';
	import AcceptCuratorRole from './operations/AcceptCuratorRole.svelte';
	import ClaimBounty from './operations/ClaimBounty.svelte';
	import ExtendBounty from './operations/ExtendBounty.svelte';

	export let bounty: Bounty;

	let extendBountyDialogOpen = false;
	let acceptCuratorRoleDialogOpen = false;
	let claimBountyDialogOpen = false;
</script>

{#if $showAllCuratorOptions || ['Proposed', 'Approved', 'Funded'].includes(bounty.status)}
	<a
		class="bg-backgroundButtonDark text-white rounded-[10px] h-[40px] w-full md:w-1/2 text-center pt-2"
		href={`/bounty-setup/curator-proposal?bounty-id=${bounty.id}`}
	>
		PROPOSE CURATOR
	</a>
{/if}

{#if $showAllCuratorOptions || (bounty.status === 'CuratorProposed' && isCurator(bounty))}
	<button
		class="bg-backgroundButtonDark text-white rounded-[10px] h-[40px] w-full md:w-1/2"
		on:click={() => {
			acceptCuratorRoleDialogOpen = true;
		}}
	>
		ACCEPT CURATOR
	</button>
{/if}

{#if $showAllCuratorOptions || (bounty.status === 'Active' && isCurator(bounty))}
	<button
		class="bg-extendButtonBackground text-white rounded-[10px] h-[40px] w-full md:w-1/2"
		on:click={() => {
			extendBountyDialogOpen = true;
		}}
	>
		EXTEND BOUNTY
	</button>
{/if}

{#if $showAllCuratorOptions || bounty.status === 'PendingPayout'}
	<button
		on:click={() => (claimBountyDialogOpen = true)}
		class="bg-backgroundButtonDark text-white rounded-[10px] h-[40px] w-full md:w-1/2"
	>
		CLAIM
	</button>
{/if}

{#if acceptCuratorRoleDialogOpen}
	<AcceptCuratorRole bind:open={acceptCuratorRoleDialogOpen} {bounty} />
{/if}
{#if extendBountyDialogOpen}
	<ExtendBounty bind:open={extendBountyDialogOpen} {bounty} />
{/if}
{#if claimBountyDialogOpen}
	<ClaimBounty bind:open={claimBountyDialogOpen} {bounty} />
{/if}
