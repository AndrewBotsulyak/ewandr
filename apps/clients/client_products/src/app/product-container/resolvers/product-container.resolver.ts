import {inject, Injectable, Injector, PLATFORM_ID, runInInjectionContext} from "@angular/core";
import {ActivatedRouteSnapshot, MaybeAsync, Resolve, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {ProductContainerService} from "../product-container.service";
import {filter, of, take} from "rxjs";
import {isPlatformServer} from "@angular/common";
import {CheckPlatformService} from "@ewandr-workspace/client-core";

export function productContainerResolver(): ResolveFn<any> {
  return () => {
    const service = inject(ProductContainerService);
    const platformService = inject(CheckPlatformService);

    if (platformService.isServer()) {
      service.getProducts();
      return service.products$.pipe(
        filter((value) => value != null),
        take(1) // Добавьте take(1) для завершения Observable
      );
    }

    return of(true);
  };
}
