import { Component, input, model, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDivider } from '@angular/material/divider';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

@Component({
  selector: 'lib-mobile-menu',
  imports: [RouterLink, FormsModule, MatIconModule, MatBadgeModule, MatDivider],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss'
})
export class MobileMenuComponent {
  isOpen = input.required<boolean>();
  categories = input<Category[]>([]);
  user = input<User | null>(null);
  currentTheme = input<'light' | 'dark'>('light');
  cartItemCount = input<number>(0);

  searchQuery = model<string>('');
  isCategoriesOpen = model<boolean>(false);

  close = output<void>();
  search = output<string>();
  categorySelect = output<string>();
  themeToggle = output<void>();
  cartClick = output<void>();
  profileClick = output<void>();
  ordersClick = output<void>();
  settingsClick = output<void>();
  logoutClick = output<void>();

  handleSearch(): void {
    const query = this.searchQuery();
    if (query.trim()) {
      this.search.emit(query);
      this.searchQuery.set('');
    }
  }

  toggleCategories(): void {
    this.isCategoriesOpen.update(value => !value);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
