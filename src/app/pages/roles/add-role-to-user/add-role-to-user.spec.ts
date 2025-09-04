import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddRoleToUser} from './add-role-to-user';

describe('AddRoleToUser', () => {
  let component: AddRoleToUser;
  let fixture: ComponentFixture<AddRoleToUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRoleToUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRoleToUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
