import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/model/ApiResponse.interface';
import { RegisterRequest } from 'src/app/model/RegisterRequest.class';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-form-register',
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.css']
})
export class FormRegisterComponent {

registerForm: FormGroup;
public passwordVisible: boolean = false;
showError: boolean = false;
errorMsg: string = '';
showSuccess: boolean = false;
successMsg: string = '';

constructor(private construct: FormBuilder, private authService: AuthService, private router: Router) {
  this.registerForm = construct.group({
    username: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
    password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$')])],
    email: ['', Validators.compose([Validators.required, Validators.email])],
  })
}

register() {

  const newUser = new RegisterRequest(
    this.registerForm.value.username,
    this.registerForm.value.password,
    this.registerForm.value.email
  );

  this.authService.register(newUser)
    .subscribe({
      next: (resp: ApiResponse) => {
        this.successMsg = resp.message;
        this.showSuccess = true;
        setTimeout(() => {
          this.showSuccess = false;
          this.registerForm.reset();
          this.router.navigate(['/login']);
        }, 2000);        
      },
      error: (err: any) => {
        this.errorMsg = err.message;
        this.showError = true;
        setTimeout(() => {
          this.showError = false;
          this.registerForm.reset();
        }, 2000);
      }
    }); 
  
}

showPass() {
  this.passwordVisible = !this.passwordVisible;
}

}
