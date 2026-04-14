import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainRoutingModule } from './main-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';

@NgModule({
  declarations: [
      ],
  imports: [
    CommonModule,
    FormsModule,
    NgxSmartModalModule.forRoot(),
    DatePickerModule,
    MainRoutingModule,
    SharedModule
  ],
  providers: [],
  bootstrap: []
})
export class MainModule { }
