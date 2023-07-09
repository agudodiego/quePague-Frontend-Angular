import { LOCALE_ID, NgModule } from '@angular/core';
import localeEs from "@angular/common/locales/es";
import { registerLocaleData } from "@angular/common";

import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule  } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { HomeComponent } from './views/home/home.component';
import { FormLoginComponent } from './components/form-login/form-login.component';
import { FormRegisterComponent } from './components/form-register/form-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentInputComponent } from './components/payment-input/payment-input.component';
import { CustomInterceptor } from './services/custom.interceptor';
import { UserBannerComponent } from './components/user-banner/user-banner.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { ListComponent } from './views/list/list.component';

registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    FormLoginComponent,
    FormRegisterComponent,
    PaymentInputComponent,
    UserBannerComponent,
    UsersListComponent,
    ListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS, useClass: CustomInterceptor,
    multi: true
    },
    {
      provide: LOCALE_ID, useValue: 'es'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
