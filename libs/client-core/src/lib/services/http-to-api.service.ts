import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {GetProductModel} from "@ewandr-workspace/core";
import {API_URL_TOKEN} from "../di-tokens";

@Injectable({ providedIn: 'root' })
export class HttpToApiService {
  private http = inject(HttpClient);

  // TODO inject API_URL from provider - remove imports from client-shell and client_products
  private readonly API_URL = inject(API_URL_TOKEN);

  SHOP_ID = '1';

  // organization = {
  //   get: () => {
  //     return this.http.get<OrganizationModel>(`${this.API_URL}/organization`);
  //   },
  //   getDetails: () => {
  //     return this.http.get<OrganizationDetailsModel>(`${this.API_URL}/organization/details`);
  //   }
  // };
  //
  // shops = {
  //   getAll: () => {
  //     return this.http.get<ShopModel[]>(`${this.API_URL}/shop`);
  //   },
  //   getById: (id: number) => {
  //     return this.http.get<ShopModel>(`${this.API_URL}/shop/${id}`);
  //   }
  // }

  // users = {
  //   getAll: () => {
  //     return this.http.get<UserModel[]>(`${this.API_URL}/user`);
  //   }
  // }

  products = {
    getAll: () => {
      const params = new HttpParams().set('shopId', this.SHOP_ID);

      return this.http.get<GetProductModel[]>(`${this.API_URL}/product`, { params });
    },

    getOne: (productId: GetProductModel['id']) => {
      const params = new HttpParams().set('shopId', this.SHOP_ID);

      return this.http.get<GetProductModel>(`${this.API_URL}/product/${productId}`, { params });
    }
  }

}
