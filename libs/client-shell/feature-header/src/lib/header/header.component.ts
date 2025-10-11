import {
  Component,
  DOCUMENT,
  HostListener,
  inject,
  OnInit,
  Renderer2,
  signal,
  computed,
  effect,
  afterNextRender,
  Injector
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CheckPlatformService } from '@ewandr-workspace/client-core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GqlDataService } from '@ewandr-workspace/data-access-graphql';

// Import child components
import { HeaderLogoComponent } from './header-logo/header-logo.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { CategoriesMenuComponent } from './categories-menu/categories-menu.component';
import { UserMenuComponent, User } from './user-menu/user-menu.component';
import { CartButtonComponent } from './cart-button/cart-button.component';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import {RoutesConstants} from "@ewandr-workspace/core";

@Component({
  selector: 'lib-header',
  imports: [
    CommonModule,
    MatIconModule,
    HeaderLogoComponent,
    SearchBarComponent,
    CategoriesMenuComponent,
    UserMenuComponent,
    CartButtonComponent,
    ThemeToggleComponent,
    MobileMenuComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private checkPlatform = inject(CheckPlatformService);
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);
  private gqlService = inject(GqlDataService);
  private router = inject(Router);
  private injector = inject(Injector);

  // Collections from GraphQL
  public collections = toSignal(this.gqlService.getCollections());

  // Transform collections for child components
  public categories = computed(() => {
    const children = this.collections() || [];
    return children.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      children: c.children?.map(child => ({
        id: child.id,
        name: child.name,
        slug: child.slug
      })) || []
    }));
  });

  // Theme management
  public currentTheme = signal<'light' | 'dark'>('light');

  // Scroll state
  public isScrolled = signal(false);
  private scrollThreshold = 50;

  // Mobile menu
  public isMobileMenuOpen = signal(false);

  // Search
  public searchQuery = signal('');
  public isSearchFocused = signal(false);

  // User state (mock - replace with actual auth service)
  public currentUser = signal<User | null>(null);

  // Cart state (mock - replace with actual cart service)
  public cartItemsCount = signal(3);

  constructor() {
    // Effect to handle theme changes - run in afterNextRender to avoid circular dependency
    afterNextRender(() => {
      effect(() => {
        if (this.checkPlatform.isBrowser()) {
          const theme = this.currentTheme();
          this.renderer.removeClass(this.document.body, theme === 'light' ? 'dark' : 'light');
          this.renderer.addClass(this.document.body, theme);
          localStorage.setItem('theme', theme);
        }
      }, { injector: this.injector });
    }, { injector: this.injector });
  }

  ngOnInit() {
    if (this.checkPlatform.isServer()) {
      return;
    }

    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      this.currentTheme.set(savedTheme);
    } else {
      this.renderer.addClass(this.document.body, 'light');
    }

    // Mock user data (replace with actual auth check)
    // this.currentUser.set({
    //   id: '1',
    //   name: 'John Doe',
    //   email: 'john@example.com',
    //   avatar: 'https://i.pravatar.cc/150?img=12'
    // });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (this.checkPlatform.isBrowser()) {
      const scrollPosition = window.scrollY || this.document.documentElement.scrollTop;
      this.isScrolled.set(scrollPosition > this.scrollThreshold);
    }
  }

  // Event handlers
  toggleMobileMenu() {
    this.isMobileMenuOpen.update(value => !value);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  toggleTheme() {
    this.currentTheme.update(theme => theme === 'light' ? 'dark' : 'light');
  }

  onSearch(query: string) {
    this.router.navigate(['/search'], { queryParams: { q: query } });
    this.searchQuery.set('');
    this.closeMobileMenu();
  }

  navigateToCart() {
    this.router.navigate(['/cart']);
    this.closeMobileMenu();
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
    this.closeMobileMenu();
  }

  navigateToOrders() {
    this.router.navigate(['/orders']);
    this.closeMobileMenu();
  }

  navigateToSettings() {
    this.router.navigate(['/settings']);
    this.closeMobileMenu();
  }

  logout() {
    // Implement logout logic
    this.currentUser.set(null);
    this.router.navigate(['/']);
    this.closeMobileMenu();
  }

  navigateToCategory(slug: string) {
    this.router.navigate([`/${RoutesConstants.CATEGORY}`, slug]);
    this.closeMobileMenu();
  }
}
