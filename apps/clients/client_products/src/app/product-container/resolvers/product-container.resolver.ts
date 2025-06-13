import {inject, Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot} from "@angular/router";
import {ProductContainerService} from "../product-container.service";
import {filter} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ProductContainerResolver implements Resolve<any> {
  service = inject(ProductContainerService);

  resolve(): MaybeAsync<any> {
    this.service.getProducts();

    return this.service.products$.pipe(
      filter((value) => value != null)
    );
  }
}
