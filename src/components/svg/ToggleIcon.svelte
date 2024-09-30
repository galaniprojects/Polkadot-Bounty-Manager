<script>
	export let checked = false;

	function toggle() {
		checked = !checked;
	}
</script>

<div class="toggle" on:click={toggle}>
	<div class="switch {checked ? 'checked' : ''}"></div>
</div>

<style>
	.toggle {
		display: inline-flex;
		align-items: center;
		cursor: pointer;
	}

	.switch {
		width: 52px;
		height: 26px;
		border-radius: 20px;
		background-color: white;
		position: relative;
		transition: background-color 0.3s;
	}

	.switch::before {
		@apply bg-curatorMainBackground;
		content: '';
		width: 22px;
		height: 22px;
		border-radius: 50%;
		position: absolute;
		top: 2px;
		left: 2px;
		transition:
			transform 0.3s,
			background-color 0.3s;
	}

	.checked::before {
		@apply bg-accent;
		transform: translateX(25px);
	}
</style>
