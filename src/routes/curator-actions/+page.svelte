<script lang="ts">
	import '../../app.css';
	import AppBar from '../../components/app-bar/AppBar.svelte';
	import '../../components/bounty-setup/style.css';
	import CuratorActions from '../../components/curator-actions/CuratorActions.svelte';
	import LoadingScreen from '../../components/LoadingScreen.svelte';
	import { loadingDialogState } from '../../stores';
</script>

<AppBar />
<CuratorActions />
<LoadingScreen bind:dialogState={$loadingDialogState} />

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
