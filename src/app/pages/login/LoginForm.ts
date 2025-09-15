import {Component, inject, ViewChild} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ReactiveFormsModule, ValidationErrors} from '@angular/forms';

import {AuthService} from '../../services/AuthService';
import {LoginRequest} from '../../models/Auth';
import {Form} from '../../components/forms/form/form';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
    selector: 'login-form',
    imports: [
        ReactiveFormsModule,
        Form,
        RouterLink
    ],
    templateUrl: './LoginForm.html',
    styleUrl: './LoginForm.scss',
})
export class LoginForm {
    @ViewChild(Form) formComponent!: Form;
    public errorMessage: string | undefined;
    public showValidationErrors: boolean = false;
    private client = inject(AuthService);
    private router = inject(Router);

    onSubmit(form: { Username: string, Password: string }): void {
        this.showValidationErrors = true;
        if (this.formComponent.form.invalid) {
            return;
        }

        const user: LoginRequest = {UserName: form.Username, password: form.Password}

        this.client.Login(user).subscribe({
            next: () => this.router.navigate(['/']).then(),
            error: (err: HttpErrorResponse) => {
                if (err.status === 0) {
                    this.errorMessage = 'Could not connect to the server. Please try again later.';
                } else {
                    this.errorMessage = err.error.message;
                }
            },
        });
    }


    isValid(): boolean {
        return this.formComponent?.isValid();
    }

    onFormErrorsChanged(_: ValidationErrors | null) {
    }
}
