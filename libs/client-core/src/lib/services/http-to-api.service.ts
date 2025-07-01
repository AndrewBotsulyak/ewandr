import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {GetProductModel} from "@ewandr-workspace/core";
import {SHOP_ID} from "../../../../../apps/clients/client_products/src/app/common/test.const";
import {CheckPlatformService} from "./check-platform.service";
import {environment} from "../../../../../apps/clients/client-shell/src/environments/environment";

@Injectable({ providedIn: 'root' })
export class HttpToApiService {
  private http = inject(HttpClient);
  private platformService = inject(CheckPlatformService);

  private readonly API_URL = environment.apiUrl;

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
      const params = new HttpParams().set('shopId', SHOP_ID);

      return this.http.get<GetProductModel[]>(`${this.API_URL}/product`, { params });
    }
  }

}
