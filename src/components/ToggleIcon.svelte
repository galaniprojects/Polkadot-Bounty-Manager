<script lang="ts">
	export let checked = false;
	export let inverted = false;
</script>

<input type="checkbox" bind:checked class="switch" data-inverted={inverted} />

<style>
	.switch {
		--width: 52px;
		--height: 26px;
		--offset: 2px;
		--knob: calc(var(--height) - var(--offset) * 2);

		appearance: none;
		cursor: pointer;
		margin: 0;
		padding: 0;
		display: inline-grid;
		flex-shrink: 0;
		inline-size: var(--width);
		block-size: var(--height);
		place-items: center;
		position: relative;
	}

	.switch[data-inverted='true'] {
		--toggle-background: rgba(101, 112, 139, 0.5);
		--switch-background: theme('colors.white');
		--switch-checked-background: theme('colors.childBountyGray');
	}

	.switch::before {
		content: '';
		display: block;
		inline-size: var(--width);
		block-size: var(--height);
		border-radius: calc(var(--height) / 2);
		background: var(--toggle-background, white);
		position: absolute;
	}

	.switch::after {
		display: block;
		background-color: var(--switch-background, theme('colors.curatorMainBackground'));
		content: '';
		inline-size: var(--knob);
		block-size: var(--knob);
		border-radius: 50%;
		position: absolute;
		inset-inline-start: var(--offset);
		transition:
			left 0.3s,
			background-color 0.3s;
	}

	.switch:checked::after {
		background: var(--switch-checked-background, theme('colors.accent'));
		inset-inline-start: calc(var(--width) - var(--knob) - var(--offset));
	}
</style>
