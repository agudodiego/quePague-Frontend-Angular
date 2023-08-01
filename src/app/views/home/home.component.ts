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
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

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

  showError: boolean = false;
  errorMsg: string = '';

  //***** Confirmation Alert *******
  showConfirmationAlert: boolean = false;

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
    this.showConfirmationAlert = true;
  }

  cancel(cancel: boolean) {
    this.showConfirmationAlert = cancel;
  }

  confirmReset(confirmation: boolean) {
    if (confirmation) {
      this.paymentService.resetMonth(this.username)
      .subscribe({
        next: (resp: ApiResponse)=> {
          const updatedUser = this.userService.loggedUser;
          updatedUser.payments.forEach((p)=> {
            p.alreadyPaid = false;
            p.payDate = null;
          });
          this.userService.setLoggedUser(updatedUser);
          this.showConfirmationAlert = false;
        },
        error: (error)=> {
          console.error(error);
        }
      });
      
    }
  }
  
  print() {

    const pdfDefinition: any = {
      content: this.paymentsListMaker(),
      styles: {
        header: {
          fontSize: 15,
          bold: true,
          marginBottom: 6
        },
        regularFont: {
          marginBottom: 3
        }
      }
    }

    const pdf = pdfMake.createPdf(pdfDefinition);
    // pdf.open();
    pdf.download();
  }

  paymentsListMaker() {
    const paymentArray: Object[] = [];

    let paymentString = {text: `PAGOS DEL MES ${this.actualMonth.getMonth()+1}`, style: 'header'};
    paymentArray.push(paymentString);

    this.loggedUser.payments.forEach( payment => {
      paymentString = { text: `${payment.title} - ${payment.payDate !== null ? payment.payDate : 'Sin pagar'} `, style: 'regularFont'};
      paymentArray.push(paymentString);
    });

    return paymentArray;
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
      this.formatDate(this.paymentToModify!.payDate),
      this.formPayed!,
      this.formNote!
    );
    
    this.paymentService.editPayment(paymentToEdit)
          .subscribe({
            next: (resp: ApiResponse)=> {
              this.localArrayUpdate(resp);
              this.closeModal();
            },
            error: (err)=> {
              console.error(err);
              this.errorMsg = err.message;
              this.showError = true;
              setTimeout(() => {
                this.showError = false;
                this.closeModal();
              }, 2000);
            }
          });    
  }

  pay(id: number, alreadyPaid: boolean) {
    if (alreadyPaid) return;
    this.paymentService.makePayment(id)
          .subscribe({
            next: (resp: ApiResponse)=> {
              this.localArrayUpdate(resp);
            },
            error: (err)=> {
              console.error(err);
              this.errorMsg = err.message;
              this.showError = true;
              setTimeout(() => {
                this.showError = false;
              }, 2000);
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
              this.closeModal();
            },
            error: (err)=> {
              console.error(err);
              this.errorMsg = err.message;
              this.showError = true;
              setTimeout(() => {
                this.showError = false;
                this.closeModal();
              }, 2000);
            }
          });      
  }

  formatDate(date: string | null): string | null {
    // if (date !== null) return date;

    const datePipe = new DatePipe('en-US');
    const today = new Date();
    if (!this.formPayed) {
      return null;      
    } else if (date !== null) {
      return date;
    } else {
      return datePipe.transform(today,'yyyy-MM-dd'); 
    }
  }

  localArrayUpdate(resp: ApiResponse) {
    const updatedPayment = resp.data as Payment;
    const newPaymentsArray = this.userService.loggedUser.payments.map((p)=> p.paymentId === updatedPayment.paymentId ? updatedPayment : p);
    console.log(newPaymentsArray)
    const user = new PersonResponse(this.username, newPaymentsArray);
    this.userService.setLoggedUser(user);
  }

}
