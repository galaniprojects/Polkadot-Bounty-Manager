<script lang="ts">
	import CuratorProposal from '../../../components/bounty-setup/CuratorProposal.svelte';
	import { bountyInfo } from '../_bountyInfo';
</script>

<CuratorProposal bind:bountyInfo={$bountyInfo} />
