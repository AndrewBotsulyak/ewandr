import {ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductContainerService} from "./product-container.service";
import {ProductStatusEnum} from "@ewandr-workspace/core";
import {ActivatedRoute} from "@angular/router";
import {filter} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {MatButtonUI} from "@ewandr-workspace/ui-shared-lib";

@Component({
  selector: 'app-product-container',
  imports: [CommonModule, MatButtonUI],
  providers: [],
  templateUrl: './product-container.component.html',
  styleUrl: './product-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductContainerComponent implements OnInit {
  private service = inject(ProductContainerService);
  private activatedRoute = inject(ActivatedRoute);

  products = toSignal(this.service.products$.pipe(
    filter(value => value != null)
  ));

  status = ProductStatusEnum;

  ngOnInit() {
    console.log('this.activatedRoute.snapshot = ', this.activatedRoute.snapshot);
  }

  public handleGetProducts() {
    this.service.getProducts();
  }
}
