import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSmartModalModule.forRoot(),
    RouterModule.forChild([{ path: '', component: LoginComponent }]),
  ],
  providers: [],
  bootstrap: []
})
export class LoginModule { }
