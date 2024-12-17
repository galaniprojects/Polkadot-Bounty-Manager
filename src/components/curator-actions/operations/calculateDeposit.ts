import { convertDotToPlanck } from '../../../utils/polkadot';

/**
 * @param fee fee in planck.
 * @returns deposit as a bigint in dots.
 **/
export function calculateDeposit(fee: bigint) {
	if (fee < convertDotToPlanck(20n)) {
		return 10n;
	}
	if (fee > convertDotToPlanck(400n)) {
		return 200n;
	}
	return fee / 2n;
}
