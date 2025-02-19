import { inject, isMimirReady, MIMIR_REGEXP } from '@mimirdev/apps-inject';

export async function maybeInjectMimir() {
	if (window === window.parent) return;

	const origin = await isMimirReady();
	if (origin && MIMIR_REGEXP.test(origin)) {
		inject();
	}
}
