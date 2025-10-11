import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

@Component({
  selector: 'lib-categories-menu',
  imports: [MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './categories-menu.component.html',
  styleUrl: './categories-menu.component.scss'
})
export class CategoriesMenuComponent {
  categories = input<Category[]>([]);
  categorySelect = output<string>();
}
