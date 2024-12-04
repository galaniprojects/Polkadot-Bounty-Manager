<script lang="ts">
	import ApprovalReferendum from '../../../components/bounty-setup/ApprovalReferendum.svelte';
	import { bountyInfo } from '../_bountyInfo';
</script>

<ApprovalReferendum bind:bountyInfo={$bountyInfo} />
