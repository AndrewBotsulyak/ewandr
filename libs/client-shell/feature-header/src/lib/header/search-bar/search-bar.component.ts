import {Component, effect, input, model, output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UiTooltipDirective } from '@ewandr-workspace/ui-shared-lib';

@Component({
  selector: 'lib-search-bar',
  imports: [FormsModule, MatIconModule, UiTooltipDirective, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  placeholder = input<string>('Search products, brands, or categories...');
  searchQuery = input<string>('');
  isFocused = model<boolean>(false);

  searchChange = output<string>();

  searchControl = new FormControl({ value: this.searchQuery(), disabled: false});

  constructor() {
    effect(() => {
      this.searchControl.setValue(this.searchQuery());
    });
  }

  handleSubmit(event?: Event): void {
    event?.preventDefault();
    const query = this.searchControl.value;
    if (query?.trim()) {
      this.searchChange.emit(query);
    }
  }

  handleRemoveSearch() {
    this.searchControl.setValue('');
    this.searchChange.emit('');
  }

  onFocus(): void {
    this.isFocused.set(true);
  }

  onBlur(): void {
    setTimeout(() => this.isFocused.set(false), 200);
  }
}
