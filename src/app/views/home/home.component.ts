import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  public paymentToModify?: Payment;

  //***** Modal *******
  public formTitle?: string;
  public formPayed?: boolean;
  public formNote?: string;

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

  resetMonth() {
    this.paymentService.resetMonth(this.username)
          .subscribe({
            next: (resp: ApiResponse)=> {
              const updatedUser = this.userService.loggedUser;
              updatedUser.payments.forEach((p)=> {
                p.alreadyPaid = false;
                p.payDate = null;
              });
              this.userService.setLoggedUser(updatedUser);
            },
            error: (error)=> {
              console.error(error);
            }
          });
  }
  
  print() {
    console.log('imprimir listado de pagos');
    console.log('todavia no implementado');
  }

  goToUsersList() {
    this.router.navigate(['/lista']);
  }

  openModal(payment: Payment) {
    const editionModal = document.getElementById('editModal');
    editionModal!.style.display = 'block';
    this.paymentToModify = payment;
    this.formPayed = payment.alreadyPaid;
    this.formTitle = payment.title;
    this.formNote = payment.note;
  }

  closeModal() {
    const editionModal = document.getElementById('editModal');
    editionModal!.style.display = 'none';
  }

  editInfo() {
    
    const paymentToEdit = new Payment(
      this.paymentToModify!.paymentId,
      this.formTitle!,
      this.formatDate(),
      this.formPayed!,
      this.formNote!
    );
    
    this.paymentService.editPayment(paymentToEdit)
          .subscribe({
            next: (resp: ApiResponse)=> {
              this.localArrayUpdate(resp);
            },
            error: (error)=> {
              console.error(error);
            }
          });

    this.closeModal();
  }

  pay(id: number, alreadyPaid: boolean) {
    if (alreadyPaid) return;
    this.paymentService.makePayment(id)
          .subscribe({
            next: (resp: ApiResponse)=> {
              this.localArrayUpdate(resp);
            },
            error: (error)=> {
              console.error(error);
            }
          });
  }

  delete() {

    this.paymentService.deletePayment(this.paymentToModify!.paymentId)
          .subscribe({
            next: (resp: ApiResponse)=> {
              const newList = this.userService.loggedUser.payments.filter((p)=> p.paymentId !== this.paymentToModify!.paymentId);
              const user = new PersonResponse(this.username, newList);
              this.userService.setLoggedUser(user);
            },
            error: (error)=> {
              console.error(error);
            }
          });
          
    this.closeModal();
  }

  formatDate(): string | null {
    const datePipe = new DatePipe('en-US');
    const today = new Date();
    if (this.formPayed) {
      return datePipe.transform(today,'yyyy-MM-dd') 
    } else {
      return null;
    }
  }

  localArrayUpdate(resp: ApiResponse) {
    const updatedPayment = resp.data as Payment;
    const newPaymentsArray = this.userService.loggedUser.payments.map((p)=> p.paymentId === updatedPayment.paymentId ? updatedPayment : p);
    const user = new PersonResponse(this.username, newPaymentsArray);
    this.userService.setLoggedUser(user);
  }
}
