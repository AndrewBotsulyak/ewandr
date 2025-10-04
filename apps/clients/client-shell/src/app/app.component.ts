import { Component, computed, inject } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { HeaderComponent } from '@ewandr-workspace/header';
import { NavbarComponent } from '@ewandr-workspace/navbar';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';

@Component({
  imports: [RouterModule, HeaderComponent, NavbarComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'client-shell';
  private router = inject(Router);

  // Track current route
  currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).url)
    ),
    { initialValue: this.router.url }
  );

  // Check if we're on the home page
  isHomePage = computed(() => {
    const url = this.currentUrl();
    return url === '/' || url === '';
  });
}
