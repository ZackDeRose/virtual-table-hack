import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualTableComponent } from './virtual-table.component';

describe('VirtualTableComponent', () => {
  let component: VirtualTableComponent;
  let fixture: ComponentFixture<VirtualTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
