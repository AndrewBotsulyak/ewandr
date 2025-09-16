import {
  Component, computed,
  inject,
  OnInit, Signal,
  signal,
} from '@angular/core';
import {ProductService} from "./product.service";
import {ActivatedRoute} from "@angular/router";
import {CommonModule} from "@angular/common";
import {BehaviorSubject, map, Observable} from "rxjs";
import {GetProductQuery, ProductOptionGroup} from "@ewandr-workspace/data-access-graphql";
import {CardSectionWrapper, MatCardModuleUI} from "@ewandr-workspace/ui-shared-lib";
import {GalleryItem, GalleryModule, ImageItem} from "ng-gallery";
import {DataSource} from "@angular/cdk/collections";
import {CdkTableModule} from "@angular/cdk/table";
import {MatTooltipModule} from "@angular/material/tooltip";
import {LightboxModule} from "ng-gallery/lightbox";

interface ProductOptionsData {
  id: ProductOptionGroup['id'],
  title: ProductOptionGroup['name'],
  options: ProductDataSource,
}

class ProductDataSource extends DataSource<any> {
  /** Stream of data that is provided to the table. */
  data = new BehaviorSubject<any[]>([]);

  constructor(optionsData: any[]) {
    super();
    this.data.next(optionsData)
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return this.data;
  }

  disconnect() {}
}


@Component({
  selector: 'app-product',
  imports: [
    CommonModule,
    CardSectionWrapper,
    MatCardModuleUI,
    GalleryModule,
    CdkTableModule,
    MatTooltipModule,
    LightboxModule
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
  private service = inject(ProductService);
  private route = inject(ActivatedRoute);

  displayedColumns: string[] = ['name', 'code'];

  // product = toSignal(this.service.selectedProduct$);
  product = signal<GetProductQuery['product'] | null>(null);

  images: Signal<GalleryItem[]> = computed(() => {
    const assets = this.product()?.assets ?? [];
    return assets?.map((item) => new ImageItem({
      src: item.source,
      thumb: item.source
    }));
  });

  productOptions: Signal<ProductOptionsData[]> = computed(() => {
    const optionGroups = this.product()?.optionGroups ?? [];

    return optionGroups.map((item) => {
      const optionsData = item.options.map(option => ({
        name: option.name,
        code: option.code,
        description: option.customFields?.description
      }))

      return {
        id: item.id,
        title: item.name,
        options: new ProductDataSource(optionsData)
      }
    });
  });

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('productId');

    if (productId == null)
      return;

    this.service.getProduct(productId).pipe(
      map(data => this.product.set(data))
    ).subscribe();
  }
}
