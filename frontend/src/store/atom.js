import { atom } from "recoil"
import { recoilPersist } from "recoil-persist"
const { persistAtom } = recoilPersist({
    key: 'recoil-persist-invoice', // A unique and consistent key for persisting the state
    storage: localStorage, // Ensure persistence uses the correct storage (localStorage is default)
});

export const viewAtom = atom({
    key: 'viewAtom', // Make sure this key is consistent
    default: {},
    effects_UNSTABLE: [persistAtom], // Persist the state across refreshes
});
export const invoiceAtom = atom({
    key: 'invoiceAtom',
    default: {},
    effects_UNSTABLE: [persistAtom],
})