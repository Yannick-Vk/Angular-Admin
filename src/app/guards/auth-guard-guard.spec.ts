import {TestBed} from '@angular/core/testing';
import {CanActivateFn} from '@angular/router';

import {authGuard} from './auth-guard';

describe('authGuardGuard', () => {
    const executeGuard: CanActivateFn = () =>
        TestBed.runInInjectionContext(() => authGuard());

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(executeGuard).toBeTruthy();
    });
});
