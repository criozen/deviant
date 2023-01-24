import { TestBed } from '@angular/core/testing';

import { CommonContractService } from './common-contract.service';

describe('CommonContractService', () => {
  let service: CommonContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
