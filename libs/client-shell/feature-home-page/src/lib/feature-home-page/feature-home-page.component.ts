import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {GqlDataService} from "@ewandr-workspace/data-access-graphql";
import {toSignal} from "@angular/core/rxjs-interop";
import {CommonModule} from "@angular/common";
import {RoutesConstants} from "@ewandr-workspace/core";

@Component({
  selector: 'lib-feature-home-page',
  imports: [CommonModule],
  templateUrl: './feature-home-page.component.html',
  styleUrl: './feature-home-page.component.scss',
})
export class FeatureHomePageComponent {
  private gqlService = inject(GqlDataService);
  private router = inject(Router);

  collections = toSignal(this.gqlService.getCollections());

  /**
   * Navigate to a specific collection page
   * @param slug - The collection slug to navigate to
   */
  navigateToCollection(slug: string): void {
    this.router.navigate([`/${RoutesConstants.CATEGORY}`, slug]);
  }
}
