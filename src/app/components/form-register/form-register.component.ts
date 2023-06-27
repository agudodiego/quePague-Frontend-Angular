import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-register',
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.css']
})
export class FormRegisterComponent {

registerForm: FormGroup;

constructor(private construct: FormBuilder, private router: Router) {
  this.registerForm = construct.group({
    username: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
    password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$')])],
    email: ['', Validators.compose([Validators.required, Validators.email])],
  })
}

register() {
  console.log('registrado');
  this.router.navigate(['/login']);
}

}
