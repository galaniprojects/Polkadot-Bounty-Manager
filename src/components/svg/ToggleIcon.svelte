<script>
	export let checked = false;

	function toggle() {
		checked = !checked;
	}
</script>

<button class="toggle" on:click={toggle}>
	<div class="switch {checked ? 'checked' : ''}"></div>
</button>

<style>
	:global(.toggle) {
		display: inline-flex;
		align-items: center;
		cursor: pointer;
	}

	:global(.switch) {
		width: 52px;
		height: 26px;
		border-radius: 20px;
		background-color: var(--toggle-background, white);
		position: relative;
		transition: background-color 0.3s;
	}

	:global(.switch::before) {
		background-color: var(--switch-background, theme('colors.curatorMainBackground'));
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

	:global(.checked::before) {
		background-color: var(--switch-checked-background, theme('colors.accent'));
		transform: translateX(25px);
	}
</style>
