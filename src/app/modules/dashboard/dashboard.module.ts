import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Ensure these components exist in your folder structure
import { NgSelectModule } from '@ng-select/ng-select';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { DashboardaddComponent } from './dashboardadd/dashboardadd.component';
import { DashboardeditComponent } from './dashboardedit/dashboardedit.component';
import { DashboardlistComponent } from './dashboardlist/dashboardlist.component';

@NgModule({
  declarations: [
    DashboardaddComponent,
    DashboardeditComponent,
    DashboardlistComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    DatePickerModule,
    NgxSmartModalModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'add', component: DashboardaddComponent },
      { path: 'edit', component: DashboardeditComponent },
      { path: '', component: DashboardlistComponent }
    ]),
  ],
  providers: [],
  bootstrap: []
})
export class DashboardModule { }
