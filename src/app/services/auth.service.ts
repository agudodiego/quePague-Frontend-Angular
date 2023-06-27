import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../model/LoginRequest.class';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  BASE_URL: string = "http://localhost:8080/API/auth"

  constructor(private http: HttpClient) { }

  register (body: any): any {
    return this.http.post(this.BASE_URL+'/register', body);
  }

  login (body: LoginRequest): any {
    return this.http.post(this.BASE_URL+'/login', body);
  }

  extractRole() {
    const token: string | null = sessionStorage.getItem('token');
    if (token != null) {           
      return JSON.parse(atob(token.split('.')[1])).role
    }
  }

  extractUsername() {
    const token: string | null = sessionStorage.getItem('token');
    if (token != null) {           
      return JSON.parse(atob(token.split('.')[1])).sub
    }
  }

}
