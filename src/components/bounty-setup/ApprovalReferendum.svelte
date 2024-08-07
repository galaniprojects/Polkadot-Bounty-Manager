<script>
	let bountyId = '#88';
	let bountyTitle = 'Community Event Activity Bounty';
</script>

<div>
	<div class="top-bar flex justify-between text-white">
		<p class="text-2xl leading-7">{`${bountyId} ${bountyTitle}`}</p>
		<p class="text-sm mt-1.5">
			<span class="opacity-50">Need more information about the Bounty Setup process? </span>
			Tap here
		</p>
	</div>

	<div class="content">
		<div>
			<div>
				<p class="text-xs mb-1">Treasury track</p>
				<select class="border w-72 rounded-md h-7 px-1" name="spenders" id="spenders">
					<option value="small">Small Spender</option>
					<option value="medium">Medium Spender</option>
					<option value="big">Big Spender</option>
				</select>
				<p class="text-xs mt-1">(preselected based on Bounty value)</p>
			</div>

			<hr class="border-white mt-5 mb-3 w-96" />

			<p class="text-xs mb-1">Submit with account</p>
			<select class="border w-72 rounded-md h-7 px-1" name="accounts" id="accounts">
				<option value="alice">Alice</option>
				<option value="bob">Bob</option>
			</select>

			<div class="mt-5 h-24 mb-10">
				<section class="mb-3">
					<p class="label text-xs">Deposit</p>
					<p class="value"><span>1,067.0000</span> DOT</p>
				</section>
				<section>
					<p class="label text-xs">Transaction fee</p>
					<p class="value"><span>0,000.0800</span> DOT</p>
				</section>
			</div>
		</div>
		<div class="flex">
			<button class="button-cancel mr-5">CANCEL</button>
			<button class="button-active">SUBMIT</button>
		</div>
	</div>
</div>
