import {inject, Injectable, PLATFORM_ID} from "@angular/core";
import {isPlatformServer} from "@angular/common";

@Injectable({providedIn: 'root'})
export class CheckPlatformService {
  private platformId = inject(PLATFORM_ID);

  isServer(): boolean {
    return isPlatformServer(this.platformId) === true;
  }
}
