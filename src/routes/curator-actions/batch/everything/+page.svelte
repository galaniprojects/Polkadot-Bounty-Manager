<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Binary } from 'polkadot-api';
	import { bounties, dotApi } from '../../../../stores';
	import { isPositiveNumber } from '../../../../utils/common';
	import { maybeTransaction, submitTransaction } from '../../../../utils/transaction';
	import { isValidAddress } from '../../../../utils/polkadot';
	import { showErrorModal } from '../../../../components/modals';
	import { getBountyCuratorError } from '../getBountyCuratorError';
	import { getAllChildBountyCalls } from '../../../../utils/getAllChildBountyCalls';
	import Input from '../../../../components/Input/Input.module.css';
	import ExtendBountyLabel from '../../../../components/ExtendBountyLabel.svelte';
	import Fee from '../../../../components/Fee.svelte';
	import Currency from '../../../../components/Currency.svelte';
	import { onMount } from 'svelte';
	import { getRemainingBalanceAndDescription } from '../../../../utils/getRemainingBalance';

	const bountyId = parseInt(page.url.searchParams.get('bounty-id') ?? '');
	$: bounty = $bounties.find(({ id }) => id === bountyId);
	$: error = getBountyCuratorError(bountyId, $bounties, bounty);

	let childBountyId: number;
	let nextAvailableChildBountyId: number;
	let remainingBalance: bigint | undefined;

	onMount(async () => {
		remainingBalance = (await getRemainingBalanceAndDescription(bountyId))?.remainingBalance;
	});

	(async () => {
		void $dotApi.query.ChildBounties.ChildBountyCount.watchValue().forEach((value) => {
			nextAvailableChildBountyId = value;
			childBountyId = Math.max(childBountyId, nextAvailableChildBountyId);
		});
		nextAvailableChildBountyId = await $dotApi.query.ChildBounties.ChildBountyCount.getValue();
		childBountyId = nextAvailableChildBountyId;
	})();

	let childBounties = [
		{ value: '', title: '', fee: '', beneficiary: '', includeClaim: true, template: false }
	];

	$: isFormValid =
		childBounties.length > 0 &&
		childBounties.every(
			({ title, value, fee, beneficiary }) =>
				title.trim().length > 0 &&
				isPositiveNumber(value) &&
				isPositiveNumber(fee) &&
				isValidAddress(beneficiary)
		);

	function validateBountyValue(this: HTMLInputElement) {
		this.setCustomValidity(isPositiveNumber(this.value) ? '' : 'Bounty value is invalid');
	}

	function validateFee(this: HTMLInputElement) {
		this.setCustomValidity(isPositiveNumber(this.value) ? '' : 'Fee value is invalid');
	}

	function validateAddress(this: HTMLInputElement) {
		this.setCustomValidity(isValidAddress(this.value) ? '' : 'Beneficiary address is invalid');
	}

	let extend = false;

	$: transaction = maybeTransaction(
		() =>
			isFormValid &&
			bounty?.curator &&
			$dotApi.tx.Utility.batch_all({
				calls: [
					...childBounties.flatMap(({ title, value, fee, beneficiary, includeClaim }, index) =>
						getAllChildBountyCalls({
							parent_bounty_id: bountyId,
							child_bounty_id: childBountyId + index,
							title,
							value,
							curator: bounty.curator as string,
							beneficiary,
							fee,
							includeClaim
						})
					),
					...(!extend
						? []
						: [
								$dotApi.tx.Bounties.extend_bounty_expiry({
									bounty_id: bountyId,
									remark: new Binary(new Uint8Array())
								}).decodedCall
							])
				]
			})
	);

	async function submit(event: SubmitEvent) {
		event.preventDefault();

		if (!transaction) {
			showErrorModal('An internal error has happened');
			return;
		}

		const success = await submitTransaction(transaction, bounty);
		if (success) {
			await goto('/curator-actions');
		}
	}

	const childBountyTemplate = {
		value: '',
		title: '',
		fee: '',
		beneficiary: '',
		includeClaim: true,
		template: true
	};

	function addNewChildBounty() {
		if (childBounties.length < 10) {
			childBounties = [...childBounties, { ...childBountyTemplate, template: false }];
		}
	}
</script>

<div class="container">
	{#if error}
		{error}
	{/if}

	{#if bounty && !error}
		<section class="header">
			<h1 class="bountyTitle">
				<span>#{bounty.id}</span>
				<span class="bountyName"> {bounty.description ?? ''}</span>
			</h1>
			<p class="text">Remaining Balance</p>
			<p class="balance">
				{#if remainingBalance}
					<Currency value={remainingBalance} />
				{:else}
					-
				{/if}
			</p>
		</section>

		<form onsubmit={submit} class="form">
			<section>
				<h2 class="formHeader">Complete Payout</h2>
			</section>
			<div class="formContent">
				<section class="stepsList">
					<h3 class="textContent">Batch all child bounty operations in one transaction:</h3>

					<ol class="textContent">
						<li>Create a new child bounty</li>
						<li>Assign the curator proxy as sub-curator</li>
						<li>Accept the sub-curator role</li>
						<li>Award the child bounty to the provided beneficiary</li>
						<li>Claim the child bounty (optional)</li>
					</ol>
				</section>

				<div class="cardsGrid">
					{#each childBounties.concat(childBountyTemplate) as child, index (child)}
						<fieldset class="card">
							<div class={child.template ? 'blurred' : ''}>
								<legend class="cardIndex">
									Child Bounty <span class="index">{index + 1}</span>
								</legend>

								<div class="inputFields">
									<input
										bind:value={child.title}
										class={Input.input}
										placeholder="Child bounty title"
										required
										disabled={child.template}
										aria-label="Child bounty title"
									/>
									<label>
										<span class="text">Child bounty value</span>
										<input
											bind:value={child.value}
											class={Input.polkadot}
											placeholder="00.00"
											required
											disabled={child.template}
											oninput={validateBountyValue}
											inputmode="decimal"
										/>
									</label>

									<label>
										<span class="text">Beneficiary</span>
										<input
											bind:value={child.beneficiary}
											class={Input.input}
											placeholder="Beneficiary account address"
											required
											disabled={child.template}
											oninput={validateAddress}
										/>
									</label>

									<label>
										<span class="text">Sub-curator fee</span>
										<input
											bind:value={child.fee}
											class={Input.polkadot}
											placeholder="00.00"
											required
											disabled={child.template}
											oninput={validateFee}
											inputmode="decimal"
										/>
									</label>

									<label class="claimChildBounty">
										<strong>Claim Child Bounty</strong>
										<input type="checkbox" bind:checked={child.includeClaim} class={Input.switch} />
									</label>

									{#if childBounties.length > 1}
										<button
											type="button"
											class="deleteButton material-symbols-outlined"
											onclick={() => {
												childBounties = childBounties.toSpliced(index, 1);
											}}
										>
											delete
										</button>
									{/if}
								</div>
							</div>

							{#if child.template && childBounties.length < 10}
								<p class="overlay">
									<button
										type="button"
										class="addButton"
										onclick={addNewChildBounty}
										aria-label="Add a new child bounty to the batch"
									>
										+
									</button>
									Add another child bounty to the batch
								</p>
							{:else if child.template && childBounties.length === 10}
								<p class="overlay">
									You have reached the maximum number of child bounties per transaction
								</p>
							{/if}
						</fieldset>
					{/each}
				</div>

				<div class="restContainer">
					<label class="extendBounty">
						<ExtendBountyLabel />
						<input type="checkbox" bind:checked={extend} class={Input.switch} />
					</label>

					<div class="indexContainer">
						<p class="text note">
							Currently, the child bounty’s index is estimated by incrementing the highest available
							on the blockchain. To create multiple bounties in one batch transaction, Bounty
							Manager increments this index by 1 for each additional bounty. <br /> Please note: if another
							bounty creates a child between this transaction’s creation and confirmation, this transaction
							will fail.
						</p>
						<label class="index">
							<span class="text">Starting Child Bounty Index</span>
							<input
								type="number"
								min={nextAvailableChildBountyId}
								bind:value={childBountyId}
								class="indexField"
								required
							/>
						</label>
					</div>

					<div>
						<p class="text">Estimated basic fee:</p>
						<p><Fee {transaction} /></p>
					</div>

					<p class="text">
						For the highest likelihood of success, ensure that the signatories confirm the
						transaction as soon as possible.
					</p>

					<p>
						<button type="submit" class="signButton"> SIGN </button>
					</p>
				</div>
			</div>
		</form>
	{/if}
</div>

<style>
	.container {
		margin: auto;
		margin-top: 13px;
		background-color: theme('colors.backgroundBounty');
		border-radius: 10px 10px 0px 0px;
		width: 754px;
		padding: 13px 5px 5px;
	}

	@media (width <= 640px) {
		.container {
			width: 100%;
		}
	}

	.header {
		display: flex;
		flex-direction: column;
		gap: 7px;
	}

	.bountyTitle {
		font-size: 20px;
		word-break: break-word;
		font-weight: 300;
	}

	.bountyName {
		font-weight: 800;
	}

	.text {
		font-size: 12px;
	}

	.form {
		display: flex;
		flex-direction: column;
		padding-top: 15px;
	}

	.formHeader {
		font-size: 18px;
		font-weight: 800;
		background-color: theme('colors.backgroundButtonLight');
		padding: 9px 7px;
	}

	.formContent {
		background-color: theme('colors.backgroundApp');
		padding: 6px 8px;
	}

	.stepsList {
		display: flex;
		gap: 60px;
	}

	.textContent {
		font-size: 14px;
		list-style-type: decimal;
		list-style-position: inside;
	}

	.cardsGrid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 24px;
		padding: 10px 0px 30px;
		@media (width <= 640px) {
			grid-template-columns: repeat(1, 1fr);
		}
	}

	.card {
		background-color: theme('colors.backgroundBounty');
		padding: 15px 10px;
		border-radius: 2px;
		border: 1px solid theme('colors.backgroundButtonDark');
		position: relative;
		min-height: 452px;
	}

	.blurred {
		filter: blur(5px);
		pointer-events: none;
		position: absolute;
	}

	.balance,
	.cardIndex {
		font-weight: 800;
	}

	.index {
		font-size: 24px;
	}

	.inputFields {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.deleteButton {
		opacity: 0.4;
		align-self: self-start;
	}

	.overlay {
		position: relative;
		display: flex;
		flex-direction: column;
		font-size: 14px;
		align-items: center;
		gap: 5px;
		margin-top: 160px;
	}

	.addButton {
		background-color: theme('colors.backgroundButtonLight');
		border-radius: 50%;
		width: 40px;
		height: 40px;
		font-size: 30px;
		font-weight: 200;
	}

	.restContainer {
		width: 360px;
		padding: 30px 7px;
		display: flex;
		flex-direction: column;
		justify-self: center;
		gap: 30px;
	}

	.extendBounty,
	.claimChildBounty {
		display: flex;
		justify-content: space-between;
		width: 100%;
		align-items: center;
	}

	.indexContainer {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.note {
		border: 1px solid red;
		border-radius: 3px;
		color: red;
		padding: 8px;
	}

	.index {
		display: flex;
		flex-direction: column;
	}

	.indexField {
		border: 1px solid theme('colors.textPrimary');
		border-radius: 3px;
		background-color: white;
		padding: 4px 0px 0px 4px;
		height: 40px;
		font-size: 18px;
	}

	.signButton {
		width: 100%;
		height: 40px;
		border-radius: 10px;
		color: white;
		background-color: theme('colors.accent');
		transition:
			background-color 0.3s ease,
			transform 0.2s ease;
	}

	.signButton:hover {
		transform: scale(1.02);
	}

	form:invalid .signButton {
		cursor: not-allowed;
		opacity: 30%;
	}
</style>
