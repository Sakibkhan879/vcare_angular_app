import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// Ensure these components exist in your folder structure
import { EnquiryaddComponent } from './enquiryadd/enquiryadd.component';
import { EnquiryeditComponent } from './enquiryedit/enquiryedit.component';
import { EnquirylistComponent } from './enquirylist/enquirylist.component';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSmartModalModule } from 'ngx-smart-modal';

@NgModule({
  declarations: [
    EnquiryaddComponent,
    EnquiryeditComponent,
    EnquirylistComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    DatePickerModule,
    NgxSmartModalModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'add', component: EnquiryaddComponent },
      { path: 'edit', component: EnquiryeditComponent },
      { path: '', component: EnquirylistComponent }
    ]),
  ],
  providers: [],
  bootstrap: []
})
export class EnquiryModule { }
