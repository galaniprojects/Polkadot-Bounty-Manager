<script lang="ts">
	import PolkadotIcon from '../common/PolkadotIcon.svelte';
	import PeopleChainName from '../PeopleChainName.svelte';

	export let name;
	export let address: string;
</script>

<!-- Account Identicon and Name -->
<div class="info">
	<div class="identicon">
		<PolkadotIcon {address} />
	</div>
	<div class="details">
		<span>{name}</span>
		<span class="address">
			<PeopleChainName {address}>{address}</PeopleChainName>
		</span>
	</div>
</div>

<style>
	.info {
		display: flex;
		align-items: center;
		cursor: pointer;
		background-color: theme('colors.backgroundButtonLight');
		gap: 12px;
		padding: 8px;
		border-radius: 8px;
		margin-top: 8px;
	}

	.identicon {
		width: 40px;
		height: 40px;
	}

	.details {
		display: flex;
		flex-direction: column;
		align-items: start;
		max-width: 350px;
	}

	@media (max-width: 768px) {
		.details {
			max-width: 250px;
		}
	}

	.address {
		font-size: 14px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
	}
</style>
