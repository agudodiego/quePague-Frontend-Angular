import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/model/ApiResponse.interface';
import { Payment } from 'src/app/model/Payment.class';
import { PersonResponse } from 'src/app/model/PersonResponse.class';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  {

  public username!: string;
  public actualMonth!: Date;
  public showLoader: boolean = true;
  public showAdminButton: boolean = false;

  constructor(private authService: AuthService, 
              private router: Router,
              private userService: UserService,
              private paymentService: PaymentService) {}

  ngOnInit() {
    this.username = this.authService.extractUsername();
    if (this.authService.extractRole() == 'ADMIN') this.showAdminButton =  true;
    this.actualMonth = new Date();

    this.userService.getUser(this.authService.extractUsername())
    .subscribe({
      next: (resp: ApiResponse)=> {
        this.userService.setLoggedUser(resp.data as PersonResponse);
        this.showLoader = false;
      },
      error: (error)=> {
        console.error(error);
      }
    });    
  }

  get loggedUser() {
    return this.userService.loggedUser;
  } 
  
  print() {
    console.log('imprimir listado de pagos')
  }

  goToUsersList() {
    this.router.navigate(['/lista']);
  }

  editInfo(id: number) {
    console.log('editar informacion', id)
  }

  pay(id: number) {
    this.paymentService.makePayment(id)
          .subscribe({
            next: (resp: ApiResponse)=> {
              const updatedPayment = resp.data as Payment;
              const newPaymentsArray = this.userService.loggedUser.payments.map((p)=> p.paymentId === updatedPayment.paymentId ? updatedPayment : p);
              const user = new PersonResponse(this.username, newPaymentsArray);
              this.userService.setLoggedUser(user);
            },
            error: (error)=> {
              console.error(error);
            }
          });
  }
}
