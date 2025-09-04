import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RoleHasUsers} from './role-has-users';

describe('RoleHasUsers', () => {
  let component: RoleHasUsers;
  let fixture: ComponentFixture<RoleHasUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleHasUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleHasUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
