 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// Ensure these components exist in your folder structure
import { LogeditComponent } from './logedit/logedit.component';
import { LogaddComponent } from './logadd/logadd.component';
import { LoglistComponent } from './loglist/loglist.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';

@NgModule({
  declarations: [
    LogaddComponent,
    LogeditComponent,
    LoglistComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgxSmartModalModule,
    ReactiveFormsModule,
    DatePickerModule,
    RouterModule.forChild([
      { path: 'add', component: LogaddComponent },
      { path: 'edit', component: LogeditComponent },
      { path: '', component: LoglistComponent }
    ]),
  ],
  providers: [],
  bootstrap: []
})
export class LogModule { }

