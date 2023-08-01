import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BASE_URL } from '../util/constants';
import { catchError } from 'rxjs';
import { handlerException } from '../util/handlerException';
import { HttpClient } from '@angular/common/http';
import { PersonResponse } from '../model/PersonResponse.class';
import { BasicPersonResponse } from '../model/BasicPersonResponse.class';
import { Payment } from '../model/Payment.class';
import { ApiResponse } from '../model/ApiResponse.interface';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _loggedUser!: PersonResponse;

  constructor(private authService: AuthService, private http: HttpClient) { }

  getUser (username: string) {
    return this.http.get<ApiResponse>(`${BASE_URL}/person/${username}`)
      .pipe(catchError(handlerException));
  }

  getUsersList () {
    return this.http.get<ApiResponse>(`${BASE_URL}/admin`)
      .pipe(catchError(handlerException));
  }

  deleteUser(username: string) {
    return this.http.delete<ApiResponse>(`${BASE_URL}/admin/${username}`)
    .pipe(catchError(handlerException));
  }

  //**** Methods on the logged user ************************************

  setLoggedUser(user: PersonResponse) {
    this._loggedUser = user;
  }

  get loggedUser() {
    this._loggedUser.payments.sort((a, b) => a.paymentId- b.paymentId);
    return this._loggedUser;
  }

  addPaymentToUser(newPayment: Payment) {
    this._loggedUser.payments.push(newPayment);
  }
}
