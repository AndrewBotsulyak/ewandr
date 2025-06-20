import {inject, Injectable, PLATFORM_ID} from "@angular/core";
import {ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot} from "@angular/router";
import {ProductContainerService} from "../product-container.service";
import {filter, of} from "rxjs";
import {isPlatformServer} from "@angular/common";
import {CheckPlatformService} from "@ewandr-workspace/client-core";

@Injectable({
  providedIn: 'root'
})
export class ProductContainerResolver implements Resolve<any> {
  private service = inject(ProductContainerService);
  private platformService = inject(CheckPlatformService);

  resolve(): MaybeAsync<any> {
    if (this.platformService.isServer()) {
      this.service.getProducts();

      // here could be multiple data source: products$, users$, ...
      // return all data that should be rendered on server side
      return this.service.products$.pipe(
        filter((value) => value != null)
      );
    }

    return of(true);
  }
}
