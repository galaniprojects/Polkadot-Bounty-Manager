<script lang="ts">
	import PolkadotIcon from '../common/PolkadotIcon.svelte';
	import PeopleChainName from '../PeopleChainName.svelte';

	export let name;
	export let address: string;
</script>

<div class="info">
	<div class="identicon">
		<PolkadotIcon {address} />
	</div>
	<div class="details">
		{name}
		<br />
		<PeopleChainName {address}>{address}</PeopleChainName>
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
		flex-shrink: 0;
	}

	.details {
		flex-grow: 1;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		text-align: left;
	}
</style>
