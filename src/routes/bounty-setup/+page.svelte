<script lang="ts">
	import BountyCreation from '../../components/bounty-setup/BountyCreation.svelte';
	import { bountyInfo } from './_bountyInfo';
</script>

<BountyCreation bind:bountyInfo={$bountyInfo} />
