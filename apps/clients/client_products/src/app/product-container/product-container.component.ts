import {ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductContainerService} from "./product-container.service";
import {ProductStatusEnum} from "@ewandr-workspace/core";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {combineLatest, filter, map, take, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {MatCardModuleUI, MatButtonUI} from "@ewandr-workspace/ui-shared-lib";

@Component({
  selector: 'app-product-container',
  imports: [CommonModule, MatButtonUI, MatCardModuleUI, RouterLink],
  providers: [],
  templateUrl: './product-container.component.html',
  styleUrl: './product-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductContainerComponent implements OnInit {
  private service = inject(ProductContainerService);
  public activatedRoute = inject(ActivatedRoute);

  // products = toSignal(this.service.products$.pipe(
  //   filter(value => value != null),
  //   tap((value) => console.log('this.service.products$ = ',value))
  // ));

  products = toSignal(this.service.getGqlProducts().pipe(
    map(data => data.items)
  ));

  status = ProductStatusEnum;

  ngOnInit() {

    // combineLatest([
    //   this.service.products$,
    //   this.service.isLoading$
    // ]).pipe(
    //   filter(([, isLoading]) => isLoading === false),
    //   take(1)
    // ).subscribe(([products]) => {
    //   if (products == null) {
    //     this.service.getProducts();
    //   }
    // });
  }

  public handleGetProducts() {
    this.service.getGqlProducts().subscribe();
  }
}
