import { TestBed } from '@angular/core/testing';

import { EtatDeTacheService } from './etat-de-tache.service';

describe('EtatDeTacheService', () => {
  let service: EtatDeTacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtatDeTacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
