<script lang="ts">
	import '../../app.css';
</script>

<slot />

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.backgroundApp);
	}
</style>
