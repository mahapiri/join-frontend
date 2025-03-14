import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactOverviewComponent } from './contact-overview.component';

describe('ContactOverviewComponent', () => {
  let component: ContactOverviewComponent;
  let fixture: ComponentFixture<ContactOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
