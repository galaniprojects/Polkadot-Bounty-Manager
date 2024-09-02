<script>
	export let index;
	export let curator;
</script>

<div class="flex items-center justify-between py-1">
	<div class="flex items-center">
		<span class="mr-3">{index + 1}.</span>
		<span class="curator-name text-sm truncate">{curator.name}</span>
	</div>
	<button class="ml-3 p-1">
		<span class="material-symbols-outlined text-accent">content_copy</span>
	</button>
</div>

<style>
	.curator-name {
		font-family: 'PT Mono';
	}
</style>
