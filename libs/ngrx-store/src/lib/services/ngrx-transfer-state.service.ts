import {Injectable, inject, makeStateKey, TransferState} from '@angular/core';
import { Store } from '@ngrx/store';
import {tap, take, filter} from 'rxjs/operators';

export const NGRX_STATE = makeStateKey('NGRX_STATE');

@Injectable({
  providedIn: 'root'
})
export class NgRxTransferStateService {
  private transferState = inject(TransferState);
  private store = inject(Store);

  // save state from server
  saveState(): void {
    this.store.pipe(
      // TODO check it when I will have multiple stores
      filter(state => Object.values(state).every((stateItem: any) => stateItem.isLoaded)),
      take(1),
      tap(state => {
        console.log('this.transferState.set(NGRX_STATE, state) = ', state);
        this.transferState.set(NGRX_STATE, state);
      })
    ).subscribe();
  }
}
