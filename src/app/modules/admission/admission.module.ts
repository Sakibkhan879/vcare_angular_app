import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AdmissionaddComponent } from './admissionadd/admissionadd.component';
import { AdmissioneditComponent } from './admissionedit/admissionedit.component';
import { AdmissionlistComponent } from './admissionlist/admissionlist.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSmartModalModule } from 'ngx-smart-modal';

@NgModule({
  declarations: [
    AdmissionaddComponent,
    AdmissioneditComponent,
    AdmissionlistComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgxSmartModalModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'add', component: AdmissionaddComponent },
      { path: 'edit', component: AdmissioneditComponent },
      { path: '', component: AdmissionlistComponent }
    ]),
  ],
  providers: [],
  bootstrap: []
})
export class AdmissionModule { }
