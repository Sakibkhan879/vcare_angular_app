import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { MainComponent } from './boot/main/main.component';
import { AuthComponent } from './boot/auth/auth.component';
import { CustomerportalauthComponent } from './boot/customerportalauth/customerportalauth.component';
import { CustomerportalmainComponent } from './boot/customerportalmain/customerportalmain.component';
import { EventQueueService } from './services/appevents.service';
import { RequestInterceptor } from './services/http-interceptor';
   @NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AuthComponent,
    CustomerportalmainComponent,
    CustomerportalauthComponent,
        ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgHttpLoaderModule.forRoot(),
    BrowserModule,
    NgSelectModule,
    NgxSmartModalModule.forRoot(),
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    SharedModule,
    DatePickerModule,
  ],
  providers: [EventQueueService,
      { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
