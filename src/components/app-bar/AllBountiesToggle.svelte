<script lang="ts">
	let isCuratorViewActive = false;

	function toggleView() {
		isCuratorViewActive = !isCuratorViewActive;
	}
</script>

<button class="toggleContainer" on:click={toggleView}>
	<div class="toggleSlider {isCuratorViewActive ? 'curatorViewActive' : ''}"></div>
	<div class="toggleOption {isCuratorViewActive ? 'inactive' : 'active'}">All bounties</div>
	<div class="toggleOption {isCuratorViewActive ? 'active' : 'inactive'}">Curator view</div>
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
		width: 110px;
		height: 40px;
		background: theme('colors.backgroundButtonDark');
		border-radius: 12px;
		transition: transform 0.3s ease-in-out;
	}

	.toggleOption {
		flex: auto;
		text-align: center;
		user-select: none;
		position: relative;
		transition: color 0.3s ease-in-out 0.05s;
	}

	.curatorViewActive {
		transform: translateX(98px);
	}

	.active {
		color: white;
	}

	.inactive {
		color: theme('colors.textPrimary');
		font-size: 14px;
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
