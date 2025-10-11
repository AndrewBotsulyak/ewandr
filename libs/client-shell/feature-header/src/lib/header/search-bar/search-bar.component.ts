import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'lib-search-bar',
  imports: [FormsModule, MatIconModule, MatTooltipModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  placeholder = input<string>('Search products, brands, or categories...');
  searchQuery = model<string>('');
  isFocused = model<boolean>(false);

  search = output<string>();

  handleSubmit(): void {
    const query = this.searchQuery();
    if (query.trim()) {
      this.search.emit(query);
    }
  }

  onFocus(): void {
    this.isFocused.set(true);
  }

  onBlur(): void {
    setTimeout(() => this.isFocused.set(false), 200);
  }
}
