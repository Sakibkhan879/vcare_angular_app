import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DummydashboardRoutingModule } from './dummydashboard-routing.module';
import { DummydashboardlistComponent } from './dummydashboardlist/dummydashboardlist.component';


@NgModule({
  declarations: [DummydashboardlistComponent],
  imports: [
    CommonModule,
    DummydashboardRoutingModule
  ]
})
export class DummydashboardModule { }
