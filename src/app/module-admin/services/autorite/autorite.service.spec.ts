import { TestBed } from '@angular/core/testing';

import { AutoriteService } from './autorite.service';

describe('AutoriteService', () => {
  let service: AutoriteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoriteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
