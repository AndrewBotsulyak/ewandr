import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {GetProductModel} from "@ewandr-workspace/core";
import {SHOP_ID} from "../../../../../apps/clients/client_products/src/app/common/test.const";
import {CheckPlatformService} from "./check-platform.service";

@Injectable({ providedIn: 'root' })
export class HttpToApiService {
  private http = inject(HttpClient);
  private platformService = inject(CheckPlatformService);

  getApiUrl(): string {
    if (this.platformService.isServer()) {
      // На сервере используем внутренний Docker URL
      return 'http://be-core-service:3000/api';
    }
    // В браузере используем относительный путь
    return '/api';
  }

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
      const baseUrl = this.getApiUrl();

      return this.http.get<GetProductModel[]>(`${baseUrl}/product`, { params });
    }
  }

}
