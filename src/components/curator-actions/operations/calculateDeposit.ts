import { convertDotToPlanck, formatPlanckToDot } from '../../../utils/polkadot';

/**
 * @param fee fee in planck.
 * @returns deposit as a string in dots.
 **/
export function calculateDeposit(fee: bigint): string {
	if (fee < convertDotToPlanck(20n)) {
		return '10';
	} else if (fee > convertDotToPlanck(400n)) {
		return '200';
	} else {
		return formatPlanckToDot(fee / BigInt(2));
	}
}
