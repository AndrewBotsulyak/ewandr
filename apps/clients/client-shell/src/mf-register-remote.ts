import {inject} from "@angular/core";
import {registerRemotes} from "@module-federation/enhanced/runtime";
import {getRemote} from "./manifest-operations";
import {CheckPlatformService} from "@ewandr-workspace/client-core";

export function mfRegisterRemote(remoteName: string) {
  const service = inject(CheckPlatformService);

  console.log(`${remoteName} route start`);

  if (service.isBrowser()) {
    const remote = getRemote(remoteName);

    console.log(`${remoteName} registerRemotes start`, remote);

    // Always try to register remotes - Module Federation runtime will handle it
    try {
      registerRemotes([remote]);
      console.log(`${remoteName} successfully registered`);
    } catch (error) {
      console.warn(`${remoteName} registerRemotes failed, will load dynamically:`, error);
    }
  }
}
