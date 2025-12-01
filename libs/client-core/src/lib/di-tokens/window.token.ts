import {inject, InjectionToken} from "@angular/core";
import {CheckPlatformService} from "../services";

export const WINDOW_TOKEN = new InjectionToken<Window | null>(
  'Global window object',
  {
    providedIn: 'root',
    factory: () => {
      const platform = inject(CheckPlatformService);
      if (platform.isBrowser()) {
        return window;
      }

      return null; // Return null on the server
    },
  },
);
