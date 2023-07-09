import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../util/constants';
import { catchError } from 'rxjs';
import { handlerException } from '../util/handlerException';
import { ApiResponse } from '../model/ApiResponse.interface';
import { DatePipe } from '@angular/common';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private authService: AuthService,
              private http: HttpClient,
              private userService: UserService) { }

  addPayment (body: any) {
    return this.http.post<ApiResponse>(`${BASE_URL}/payment`, body)
      .pipe(catchError(handlerException));
  }

  makePayment(id: number) {
    const datePipe = new DatePipe('en-US');

    const payment = this.userService.loggedUser.payments.find((p)=> p.paymentId == id);
    const today = new Date();
    payment!.payDate = datePipe.transform(today,'yyyy-MM-dd');
    payment!.alreadyPaid = true;

    return this.http.put<ApiResponse>(`${BASE_URL}/payment`, payment)
    .pipe(catchError(handlerException));    
  }
}
