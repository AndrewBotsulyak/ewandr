import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SearchBarComponent } from './search-bar.component';
import { UiTooltipDirective } from '@ewandr-workspace/ui-shared-lib';
import { ComponentRef } from '@angular/core';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let componentRef: ComponentRef<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SearchBarComponent,
        ReactiveFormsModule,
        MatIconModule,
        UiTooltipDirective
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Inputs', () => {
    it('should have default placeholder text', () => {
      expect(component.placeholder()).toBe('Search products, brands, or categories...');
    });

    it('should accept custom placeholder', () => {
      componentRef.setInput('placeholder', 'Custom placeholder');
      fixture.detectChanges();
      expect(component.placeholder()).toBe('Custom placeholder');
    });

    it('should accept searchQuery input', () => {
      componentRef.setInput('searchQuery', 'test query');
      fixture.detectChanges();
      expect(component.searchQuery()).toBe('test query');
    });

    it('should sync searchQuery input with searchControl value via effect', () => {
      componentRef.setInput('searchQuery', 'initial query');
      fixture.detectChanges();
      expect(component.searchControl.value).toBe('initial query');

      componentRef.setInput('searchQuery', 'updated query');
      fixture.detectChanges();
      expect(component.searchControl.value).toBe('updated query');
    });
  });

  describe('Form Control', () => {
    it('should initialize searchControl with searchQuery value', () => {
      expect(component.searchControl).toBeDefined();
      expect(component.searchControl.value).toBe('');
    });

    it('should update searchControl when user types', () => {
      const input = fixture.nativeElement.querySelector('.search-input') as HTMLInputElement;
      input.value = 'new search';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.searchControl.value).toBe('new search');
    });
  });

  describe('handleSubmit', () => {
    it('should emit searchChange with trimmed query on submit', () => {
      let emittedValue: string | undefined;
      component.searchChange.subscribe((value: string) => {
        emittedValue = value;
      });

      component.searchControl.setValue('test query');
      component.handleSubmit();

      expect(emittedValue).toBe('test query');
    });

    it('should not emit if query is empty or whitespace', () => {
      let emitCount = 0;
      component.searchChange.subscribe(() => {
        emitCount++;
      });

      component.searchControl.setValue('');
      component.handleSubmit();
      expect(emitCount).toBe(0);

      component.searchControl.setValue('   ');
      component.handleSubmit();
      expect(emitCount).toBe(0);
    });

    it('should prevent default event if event is passed', () => {
      const mockEvent = new Event('submit');
      jest.spyOn(mockEvent, 'preventDefault');

      component.searchControl.setValue('test');
      component.handleSubmit(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should handle submit without event parameter', () => {
      let emittedValue: string | undefined;
      component.searchChange.subscribe((value: string) => {
        emittedValue = value;
      });

      component.searchControl.setValue('test');
      component.handleSubmit();

      expect(emittedValue).toBe('test');
    });
  });

  describe('handleRemoveSearch', () => {
    it('should clear searchControl value', () => {
      component.searchControl.setValue('some query');
      component.handleRemoveSearch();

      expect(component.searchControl.value).toBe('');
    });

    it('should emit empty string on searchChange', () => {
      let emittedValue: string | undefined;
      component.searchChange.subscribe((value: string) => {
        emittedValue = value;
      });

      component.searchControl.setValue('some query');
      component.handleRemoveSearch();

      expect(emittedValue).toBe('');
    });
  });

  describe('Focus handling', () => {
    it('should set isFocused to true on focus', () => {
      component.isFocused.set(false);
      component.onFocus();

      expect(component.isFocused()).toBe(true);
    });

    it('should set isFocused to false on blur after timeout', (done) => {
      component.isFocused.set(true);
      component.onBlur();

      expect(component.isFocused()).toBe(true);

      setTimeout(() => {
        expect(component.isFocused()).toBe(false);
        done();
      }, 250);
    });
  });

  describe('Template rendering', () => {
    it('should render search input with placeholder', () => {
      const input = fixture.nativeElement.querySelector('.search-input') as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(input.placeholder).toBe('Search products, brands, or categories...');
    });

    it('should render search icon', () => {
      const icon = fixture.nativeElement.querySelector('.search-icon');
      expect(icon).toBeTruthy();
      expect(icon.textContent).toContain('search');
    });

    it('should show clear and find buttons when searchControl has value', () => {
      componentRef.setInput('searchQuery', 'test');
      fixture.detectChanges();

      const clearBtn = fixture.nativeElement.querySelector('.clear-search');
      const findBtn = fixture.nativeElement.querySelector('.search-btn');

      expect(clearBtn).toBeTruthy();
      expect(findBtn).toBeTruthy();
    });

    it('should hide clear and find buttons when searchControl is empty', () => {
      component.searchControl.setValue('');
      componentRef.setInput('searchQuery', '');
      fixture.detectChanges();

      const clearBtn = fixture.nativeElement.querySelector('.clear-search');
      const findBtn = fixture.nativeElement.querySelector('.search-btn');

      expect(clearBtn).toBeFalsy();
      expect(findBtn).toBeFalsy();
    });

    it('should show clear and find buttons when searchQuery input has value', () => {
      componentRef.setInput('searchQuery', 'test query');
      fixture.detectChanges();

      const clearBtn = fixture.nativeElement.querySelector('.clear-search');
      const findBtn = fixture.nativeElement.querySelector('.search-btn');

      expect(clearBtn).toBeTruthy();
      expect(findBtn).toBeTruthy();
    });

    it('should apply focused class when isFocused is true', () => {
      component.isFocused.set(true);
      fixture.detectChanges();

      const searchSection = fixture.nativeElement.querySelector('.search-section');
      expect(searchSection.classList.contains('focused')).toBe(true);
    });

    it('should not apply focused class when isFocused is false', () => {
      component.isFocused.set(false);
      fixture.detectChanges();

      const searchSection = fixture.nativeElement.querySelector('.search-section');
      expect(searchSection.classList.contains('focused')).toBe(false);
    });

    it('should trigger handleSubmit when form is submitted', () => {
      componentRef.setInput('searchQuery', 'test');
      fixture.detectChanges();

      jest.spyOn(component, 'handleSubmit');

      const form = fixture.nativeElement.querySelector('form');
      form.dispatchEvent(new Event('submit'));

      expect(component.handleSubmit).toHaveBeenCalled();
    });

    it('should trigger handleRemoveSearch when clear button is clicked', () => {
      componentRef.setInput('searchQuery', 'test');
      fixture.detectChanges();

      jest.spyOn(component, 'handleRemoveSearch');

      const clearBtn = fixture.nativeElement.querySelector('.clear-search') as HTMLButtonElement;
      clearBtn.click();

      expect(component.handleRemoveSearch).toHaveBeenCalled();
    });

    it('should trigger handleSubmit when find button is clicked', () => {
      componentRef.setInput('searchQuery', 'test');
      fixture.detectChanges();

      jest.spyOn(component, 'handleSubmit');

      const findBtn = fixture.nativeElement.querySelector('.search-btn') as HTMLButtonElement;
      findBtn.click();

      expect(component.handleSubmit).toHaveBeenCalled();
    });

    it('should trigger onFocus when input is focused', () => {
      jest.spyOn(component, 'onFocus');
      const input = fixture.nativeElement.querySelector('.search-input') as HTMLInputElement;

      input.dispatchEvent(new Event('focus'));
      fixture.detectChanges();

      expect(component.onFocus).toHaveBeenCalled();
    });

    it('should trigger onBlur when input loses focus', () => {
      jest.spyOn(component, 'onBlur');
      const input = fixture.nativeElement.querySelector('.search-input') as HTMLInputElement;

      input.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(component.onBlur).toHaveBeenCalled();
    });
  });
});