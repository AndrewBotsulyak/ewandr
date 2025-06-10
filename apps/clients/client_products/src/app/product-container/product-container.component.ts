import {ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductContainerService} from "./product-container.service";
import {ProductStatusEnum} from "@ewandr-workspace/core";
import {ProductContainerResolver} from "./resolvers/product-container.resolver";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-container',
  imports: [CommonModule],
  providers: [],
  templateUrl: './product-container.component.html',
  styleUrl: './product-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductContainerComponent implements OnInit {
  private service = inject(ProductContainerService);
  private activatedRoute = inject(ActivatedRoute);

  products = signal(this.activatedRoute.snapshot.data['products']);

  status = ProductStatusEnum;

  ngOnInit() {
    console.log('this.activatedRoute.snapshot = ', this.activatedRoute.snapshot);
  }
}
