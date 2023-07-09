import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../model/LoginRequest.class';
import { BASE_URL } from '../util/constants';
import { catchError } from 'rxjs';
import { handlerException } from '../util/handlerException';
import { ApiResponse } from '../model/ApiResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${BASE_URL}/auth`;

  constructor(private http: HttpClient) { }

  register (body: any): any {
    return this.http.post(this.apiUrl+'/register', body)
            .pipe(catchError(handlerException));
  }

  login (body: LoginRequest) {
    return this.http.post<ApiResponse>(this.apiUrl+'/login', body)
            .pipe(catchError(handlerException));
  }

  // ------------------ Metodos para el Token -----------------------

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
