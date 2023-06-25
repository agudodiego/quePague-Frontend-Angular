import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  BASE_URL: String = "http://localhost:8080/API/auth"

  constructor(private http: HttpClient) { }

  login (body: any): any {
    return this.http.post(this.BASE_URL+'/login', body);
  }

}
