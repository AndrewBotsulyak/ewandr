import {inject, Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot} from "@angular/router";
import {ProductContainerService} from "../product-container.service";


@Injectable({
  providedIn: 'root'
})
export class ProductContainerResolver implements Resolve<any> {
  service = inject(ProductContainerService);

  resolve(): MaybeAsync<any> {
    return this.service.getProducts();
  }
}
