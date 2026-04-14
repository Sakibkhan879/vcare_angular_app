import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CustomersidebarComponent } from './customersidebar/customersidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CustomernavbarComponent } from './customernavbar/customernavbar.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { NgSelectModule } from '@ng-select/ng-select';

import { HttpClient, HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    CustomernavbarComponent,
    CustomersidebarComponent,
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    HttpClientModule,
     NgxSmartModalModule.forRoot(),
  ],
  providers: [],
  exports: [NavbarComponent,
            SidebarComponent,
            CustomernavbarComponent,
            CustomersidebarComponent],
  bootstrap: []
})
export class SharedModule { }
