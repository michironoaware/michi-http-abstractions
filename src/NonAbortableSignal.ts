const abortController = new AbortController();

export const NonAbortableSignal = abortController.signal;

NonAbortableSignal.addEventListener = () => {};
NonAbortableSignal.removeEventListener = () => {};
Object.freeze(NonAbortableSignal);
