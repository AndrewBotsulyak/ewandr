import {ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductContainerService} from "./product-container.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {ProductStatusEnum} from "@ewandr-workspace/core";

@Component({
  selector: 'app-product-container',
  imports: [CommonModule],
  providers: [ProductContainerService],
  templateUrl: './product-container.component.html',
  styleUrl: './product-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductContainerComponent implements OnInit {
  private service = inject(ProductContainerService);

  products: WritableSignal<any> = signal(null);

  status = ProductStatusEnum;

  ngOnInit() {
    this.service.getProducts().subscribe(value => {
      this.products.set(value);
    });
    
  }
}
