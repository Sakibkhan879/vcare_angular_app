import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { MainComponent } from './boot/main/main.component';
import { AuthComponent } from './boot/auth/auth.component';
import { CustomerportalmainComponent } from './boot/customerportalmain/customerportalmain.component';
import { CustomerportalauthComponent } from './boot/customerportalauth/customerportalauth.component';
import { AuthGuard } from './services/authguard.service';



const routes: Routes = [
  {
    path: 'app',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: []
      },
      {
        path: 'admission',
        loadChildren: () => import('./modules/admission/admission.module').then(m => m.AdmissionModule),
        canActivate: []
      },
      {
        path: 'enquiry',
        loadChildren: () => import('./modules/enquiry/enquiry.module').then(m => m.EnquiryModule),
        canActivate: []
      },
      {
        path: 'customer',
        loadChildren: () => import('./modules/customer/customer.module').then(m => m.CustomerModule),
        canActivate: []
      }
    ]
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule),
      }
    ]
  },
  {
    path: 'customerportal',
    component: CustomerportalauthComponent,
    children: [
      // {
      //   path: '',
      //   loadChildren: () => import('./modules/invoice/invoice.module').then(m => m.InvoiceModule)
      // },
      // {
      //   path: 'customerpassword',
      //   loadChildren: () => import('./modules/Customer_Password/customerPassword.module').then(m => m.customerPasswordModule)
      // }
    ]
  },
  {
    path: 'customerportal',
    component: CustomerportalmainComponent,
    children: [
      // {
      //   path: 'dashboard',
      //   loadChildren: () => import('./modules/customerdashboard/customerorder.module').then(m => m.CustomerorderModule)
      // },
      // {
      //   path: 'customernotification',
      //   loadChildren: () => import('./modules/customernotification/customernotification.module').then(m => m.CustomernotificationModule)
      // },
      // {
      //   path: 'customerprofile',
      //   loadChildren: () => import('./modules/customerProfile/customerprofile.module').then(m => m.CustomerprofileModule)
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
