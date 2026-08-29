import { ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { PlatformService } from '../../core/services/platform/platform.service';
import { InputSearchComponent } from './input-search.component';

describe('InputSearchComponent', () => {
  function createComponent(pathname = '/'): {
    component: InputSearchComponent;
    router: jasmine.SpyObj<any>;
  } {
    const router = jasmine.createSpyObj('Router', ['navigate']);
    const platform = jasmine.createSpyObj<PlatformService>('PlatformService', ['getPathname']);
    platform.getPathname.and.returnValue(pathname);
    const component = new InputSearchComponent(new FormBuilder(), router, platform);
    component.ngOnInit();
    return { component, router };
  }

  it('submits a meaningful short term through the existing search route', () => {
    const { component, router } = createComponent();
    let submittedTerm = '';
    component.searchSubmitted.subscribe((term) => (submittedTerm = term));
    component.searchForm.setValue({ paramSearch: ' C# ' });

    component.search();

    expect(router.navigate).toHaveBeenCalledWith(['/buscar', 'C#']);
    expect(submittedTerm).toBe('C#');
    expect(component.searchAlert).toBeFalse();
  });

  it('keeps an empty search in place and shows feedback', () => {
    const { component, router } = createComponent();
    component.searchForm.setValue({ paramSearch: '   ' });

    component.search();

    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.searchAlert).toBeTrue();
  });

  it('exposes focus without duplicating input knowledge in the header', () => {
    const { component } = createComponent();
    const focus = jasmine.createSpy('focus');
    component.searchInput = new ElementRef({ focus } as unknown as HTMLInputElement);

    component.focus();

    expect(focus).toHaveBeenCalled();
  });
});
