import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { FormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const routes: Routes = [];

@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    CommonModule,
    NgxSmartModalModule.forRoot(),
    RouterModule.forChild(routes),
    FormsModule
  ],
  providers: [],
  bootstrap: []
})
export class AuthModule { }
