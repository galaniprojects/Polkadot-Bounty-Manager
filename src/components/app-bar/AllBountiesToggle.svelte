<script lang="ts">
	import { showAllBounties } from '../../stores';

	function toggleView() {
		showAllBounties.set(!$showAllBounties);
	}
</script>

<button class="toggleContainer" on:click={toggleView}>
	<div class="toggleSlider {!$showAllBounties ? 'curatorViewActive' : ''}"></div>
	<div class="toggleOption {$showAllBounties ? 'active' : 'inactive'}">All bounties</div>
	<div class="toggleOption {$showAllBounties ? 'inactive' : 'active'}">Curator view</div>
</button>

<style>
	.toggleContainer {
		position: relative;
		display: flex;
		background: theme('colors.backgroundButtonLight');
		border-radius: 12px;
		width: 218px;
		height: 50px;
		align-items: center;
		cursor: pointer;
	}

	.toggleSlider {
		position: absolute;
		top: 5px;
		left: 5px;
		width: 100px;
		height: 40px;
		background: theme('colors.backgroundButtonDark');
		border-radius: 12px;
		transition: transform 0.2s ease-in-out;
	}

	.toggleOption {
		flex: auto;
		text-align: center;
		user-select: none;
		position: relative;
		transition: color 0.2s ease-in-out 0.025s;
		width: 109px;
	}

	.curatorViewActive {
		transform: translateX(108px);
	}

	.active {
		color: white;
	}

	.inactive {
		color: theme('colors.textPrimary');
	}

	@media (max-width: 375px) {
		.toggleContainer {
			width: 150px;
			padding: 2px;
		}

		.toggleSlider {
			width: 70px;
		}

		.curatorViewActive {
			transform: translateX(70px);
		}

		.active,
		.inactive {
			font-size: 12px;
		}
	}
</style>
