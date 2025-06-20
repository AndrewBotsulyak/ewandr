import { ActionReducer, INIT, UPDATE } from '@ngrx/store';
import {TransferState, makeStateKey, inject} from '@angular/core';
import {NGRX_STATE} from "./services";


export function hydrationMetaReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  let hasHydrated = false;

  return (state, action) => {
    if (action.type === INIT && !hasHydrated) {
      hasHydrated = true;

      try {
        const transferState = inject(TransferState);
        const savedState = transferState.get(NGRX_STATE, null);

        if (savedState) {
          console.log('Hydrating state from TransferState:', savedState);
          transferState.remove(NGRX_STATE);
          return savedState;
        }
      } catch (e) {
        console.log('Could not inject TransferState in meta-reducer');
      }
    }

    return reducer(state, action);
  };
}
