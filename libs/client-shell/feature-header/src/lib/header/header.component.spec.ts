import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { provideRouter } from '@angular/router';
import { CheckPlatformService, HeaderService } from '@ewandr-workspace/client-core';
import { GqlDataService } from '@ewandr-workspace/data-access-graphql';
import { of } from 'rxjs';
import { signal } from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const mockCheckPlatformService = {
    isBrowser: jest.fn().mockReturnValue(false),
    isServer: jest.fn().mockReturnValue(true)
  };

  const mockGqlDataService = {
    getCollections: jest.fn().mockReturnValue(of([
      {
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        children: [
          { id: '1-1', name: 'Laptops', slug: 'laptops' },
          { id: '1-2', name: 'Phones', slug: 'phones' }
        ]
      },
      {
        id: '2',
        name: 'Clothing',
        slug: 'clothing',
        children: []
      }
    ]))
  };

  const mockHeaderService = {
    searchTerm: signal(''),
    setSearchTerm: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        { provide: CheckPlatformService, useValue: mockCheckPlatformService },
        { provide: GqlDataService, useValue: mockGqlDataService },
        { provide: HeaderService, useValue: mockHeaderService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
