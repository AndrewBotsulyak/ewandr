import {filter, Observable, of, take} from "rxjs";
import {inject} from "@angular/core";
import {CheckPlatformService} from "@ewandr-workspace/client-core";
import {GqlDataService} from "@ewandr-workspace/data-access-graphql";
import {ActivatedRouteSnapshot} from "@angular/router";

export function collectionItemContainerResolver(route: ActivatedRouteSnapshot): Observable<any> {
  const platformService = inject(CheckPlatformService);
  const gqlService = inject(GqlDataService);

  if (platformService.isServer()) {
    const slug = route.paramMap.get('slug')!;

    return gqlService.getCollection({ slug }).pipe(
      filter(data => data != null),
    );
  }

  return of(null);
}
