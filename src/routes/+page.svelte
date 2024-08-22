<script lang="ts">
	import '../app.css';
	import '../components/bounty-setup/style.css';
	import BountySetup from '../components/bounty-setup/BountySetup.svelte';
	import AppBar from '../components/AppBar.svelte';
	import CuratorActions from '../components/curator-actions/CuratorActions.svelte';
</script>


<AppBar/>
<BountySetup/> 
 

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
