// Carries the chosen blood-test file across the onboarding steps (upload ->
// analyzing) without stuffing a File into router state or the URL. Client-only,
// single-session; a hard reload mid-flow drops it (the user just re-picks).
let pending: File | null = null;
export const setPendingFile = (f: File | null) => { pending = f; };
export const getPendingFile = (): File | null => pending;
export const clearPendingFile = () => { pending = null; };
