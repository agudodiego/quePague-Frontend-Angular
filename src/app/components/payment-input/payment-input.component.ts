import { Component } from '@angular/core';
import { ApiResponse } from 'src/app/model/ApiResponse.interface';
import { Payment } from 'src/app/model/Payment.class';
import { PaymentService } from 'src/app/services/payment.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-payment-input',
  templateUrl: './payment-input.component.html',
  styleUrls: ['./payment-input.component.css']
})
export class PaymentInputComponent {

  public paymentName: string = '';

  constructor(private userService: UserService, private paymentService: PaymentService) {}

  addPayment() {

    if (this.paymentName == '') return;
    
    const body = {
      username: this.userService.loggedUser.username,
      title: this.paymentName
    }
    this.paymentService.addPayment(body)
        .subscribe({
          next: (resp: ApiResponse)=> {
            this.userService.addPaymentToUser(resp.data as Payment);
          },
          error: (error)=> {
            console.error(error);
          }
        })

    this.paymentName = '';
  }

}
