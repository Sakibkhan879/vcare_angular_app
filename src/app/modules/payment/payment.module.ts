import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// Ensure these components exist in your folder structure
import { PaymentaddComponent } from './paymentadd/paymentadd.component';
import { PaymenteditComponent } from './paymentedit/paymentedit.component';
import { PaymentlistComponent } from './paymentlist/paymentlist.component';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSmartModalModule } from 'ngx-smart-modal';

@NgModule({
  declarations: [
    PaymentaddComponent,
    PaymenteditComponent,
    PaymentlistComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    DatePickerModule,
    NgxSmartModalModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'add', component: PaymentaddComponent },
      { path: 'edit', component: PaymenteditComponent },
      { path: '', component: PaymentlistComponent }
    ]),
  ],
  providers: [],
  bootstrap: []
})
export class PaymentModule { }
