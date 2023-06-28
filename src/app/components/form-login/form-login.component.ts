import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/model/LoginRequest.class';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.css']
})
export class FormLoginComponent {

  loginForm: FormGroup;

  constructor(private construct: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = construct.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$')])]
    })
  }

  loginIn() {
    const user = new LoginRequest(
      this.loginForm.value.username,
      this.loginForm.value.password
    );

    this.authService.login(user)
      .subscribe({
        next: (resp:any) => {
          sessionStorage.setItem('token', resp.data.token);
          this.router.navigate(['/home']);
        },
        error: (err: any) => {
          console.log(err);
        }
      });

  }

}
