import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MyBlogs} from './my-blogs';

describe('MyBlogs', () => {
    let component: MyBlogs;
    let fixture: ComponentFixture<MyBlogs>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MyBlogs]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MyBlogs);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
