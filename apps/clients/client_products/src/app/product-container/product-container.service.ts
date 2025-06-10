import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {SHOP_ID} from "../common/test.const";
import {API_URL_TOKEN, GetProductModel} from "@ewandr-workspace/core";

@Injectable()
export class ProductContainerService {
  private http = inject(HttpClient);
  private API_URL = inject(API_URL_TOKEN);

  getProducts() {
    const params = new HttpParams().set('shopId', SHOP_ID);

    return this.http.get<GetProductModel[]>(`${this.API_URL}/product`, { params });
  }
}
