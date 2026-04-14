import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { DashboardComponent } from './dashboard.component';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePickerModule,
    NgxSmartModalModule.forRoot(),
    NgSelectModule,
    RouterModule.forChild([{ path:'', component: DashboardComponent}
    ]),
  ],
  providers: [],
  bootstrap: []
})
export class DashboardModule { }
