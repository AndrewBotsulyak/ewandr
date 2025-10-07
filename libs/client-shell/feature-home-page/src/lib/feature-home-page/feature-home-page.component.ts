import {Component, inject, signal, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {GqlDataService} from "@ewandr-workspace/data-access-graphql";
import {toSignal} from "@angular/core/rxjs-interop";
import {CommonModule} from "@angular/common";
import {RoutesConstants} from "@ewandr-workspace/core";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'lib-feature-home-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './feature-home-page.component.html',
  styleUrl: './feature-home-page.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FeatureHomePageComponent {
  private gqlService = inject(GqlDataService);
  private router = inject(Router);

  collections = toSignal(this.gqlService.getCollections());
  newsletterEmail = signal('');
  isSubscribing = signal(false);

  /**
   * Navigate to a specific collection page
   * @param slug - The collection slug to navigate to
   */
  navigateToCollection(slug: string): void {
    this.router.navigate([`/${RoutesConstants.CATEGORY}`, slug]);
  }

  /**
   * Navigate to products/catalog page
   */
  navigateToProducts(): void {
    // Navigate to first collection or a products page
    const firstCollection = this.collections()?.children?.[0];
    if (firstCollection) {
      this.navigateToCollection(firstCollection.slug);
    }
  }

  /**
   * Navigate to catalog/all collections
   */
  navigateToCatalog(): void {
    // Navigate to collections list or first collection
    const firstCollection = this.collections()?.children?.[0];
    if (firstCollection) {
      this.navigateToCollection(firstCollection.slug);
    }
  }

  /**
   * Handle newsletter subscription
   */
  subscribeToNewsletter(): void {
    const email = this.newsletterEmail();
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    this.isSubscribing.set(true);

    // Simulate API call
    setTimeout(() => {
      this.isSubscribing.set(false);
      alert(`Thank you for subscribing with ${email}!`);
      this.newsletterEmail.set('');
    }, 1000);
  }
}
