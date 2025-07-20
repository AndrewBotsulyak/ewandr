import {ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductContainerService} from "./product-container.service";
import {ProductStatusEnum} from "@ewandr-workspace/core";
import {ActivatedRoute} from "@angular/router";
import {filter, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {MatButtonUI} from "@ewandr-workspace/ui-shared-lib";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-product-container',
  imports: [CommonModule, MatButtonUI, MatCardModule],
  providers: [],
  templateUrl: './product-container.component.html',
  styleUrl: './product-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductContainerComponent implements OnInit {
  private service = inject(ProductContainerService);

  products = toSignal(this.service.products$.pipe(
    filter(value => value != null),
    tap((value) => console.log('this.service.products$ = ',value))
  ));

  status = ProductStatusEnum;

  ngOnInit() {
  }

  public handleGetProducts() {
    this.service.getProducts();
  }
}
