import {inject} from "@angular/core";
import {ProductContainerService} from "../product-container.service";
import {filter, Observable, of, take} from "rxjs";
import {CheckPlatformService} from "@ewandr-workspace/client-core";

export function productContainerResolver(): Observable<any> {
  const service = inject(ProductContainerService);
  const platformService = inject(CheckPlatformService);

  if (platformService.isServer()) {
    console.log('platformService.isServer() = ', platformService.isServer());
    service.getProducts();
    return service.products$.pipe(
      filter((value) => value != null),
      take(1)
    );
  }

  return of(true);
}
