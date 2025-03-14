<script lang="ts">
	import type { Bounty } from '../../types/bounty';
	import { bounties } from '../../stores';
	import { showErrorModal } from '../../components/modals';
	import BountyCard from '../../components/curator-actions/BountyCard.svelte';

	let bounty: Bounty | undefined;
	$: bounty = (() => {
		const urlParams = new URLSearchParams(window.location.search);
		const bountyId = urlParams.get('id');
		if (!bountyId) {
			showErrorModal('Invalid bounty ID.');
			return;
		}

		const b = $bounties.find((b) => b.id === parseInt(bountyId));
		if (!b) {
			showErrorModal('Bounty not found.');
			return;
		}
		return b;
	})();
</script>

{#if bounty}
	<div
		class="flex justify-center items-center overflow-y-hidden min-h-[70vh]"
		data-pagination-scroll
	>
		<div class="w-full md:w-[754px] p-2 md:p-0">
			<BountyCard {bounty} />
		</div>
	</div>
{/if}
