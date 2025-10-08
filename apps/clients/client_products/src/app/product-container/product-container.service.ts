import {DestroyRef, inject, Injectable, signal} from '@angular/core';
import {Store} from "@ngrx/store";
import {GqlDataService} from "@ewandr-workspace/data-access-graphql";

@Injectable({
  providedIn: "root"
})
export class ProductContainerService {
  store = inject(Store);
  gqlService = inject(GqlDataService);
  destroyRef = inject(DestroyRef);

  constructor() {
    this.destroyRef.onDestroy(() => console.log('this.destroyRef.onDestroy'));
  }
}
