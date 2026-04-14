import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CustomeraddComponent } from './customeradd/customeradd.component';
import { CustomereditComponent } from './customeredit/customeredit.component';
import { CustomerlistComponent } from './customerlist/customerlist.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSmartModalModule } from 'ngx-smart-modal';

@NgModule({
  declarations: [
    CustomeraddComponent,
    CustomereditComponent,
    CustomerlistComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgxSmartModalModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'add', component: CustomeraddComponent },
      { path: 'edit', component: CustomereditComponent },
      { path: '', component: CustomerlistComponent }
    ]),
  ],
  providers: [],
  bootstrap: []
})
export class CustomerModule { }
