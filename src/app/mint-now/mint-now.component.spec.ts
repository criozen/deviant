import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintNowComponent } from './mint-now.component';

describe('MintNowComponent', () => {
  let component: MintNowComponent;
  let fixture: ComponentFixture<MintNowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MintNowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintNowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
