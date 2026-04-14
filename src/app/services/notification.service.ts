import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  userData: any = {};

  constructor(private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {

  }


  notificationListPromise() {
    this.getUserData();
    var obj = { companyid: this.userData.companyid, logininfoid: this.userData.logininfoid };
    var url = this.baseUrl + "api/notification/LoadCompanyNotificationList";
    return this.http.post<any>(url, obj);
  }

  notificationClearAllPromise() {
    this.getUserData();
    var obj = { companyid: this.userData.companyid, logininfoid: this.userData.logininfoid };
    var url = this.baseUrl + "api/notification/ClearAllCompanyNotification";
    return this.http.post<any>(url, obj);
  }

  notificationDeletePromise(data) {
    this.getUserData();
    data.companyid = this.userData.companyid;
    data.logininfoid= this.userData.logininfoid;
    var url = this.baseUrl + "api/notification/ClearNotificationById";
    return this.http.post<any>(url, data);
  }

  loadAllNotificationListPromise() {
    this.getUserData();
    var obj = { companyid: this.userData.companyid, logininfoid: this.userData.logininfoid };
    var url = this.baseUrl + "api/notification/CompanyDashboardNotificationList";
    return this.http.post<any>(url, obj);
  }


  loadCountofNotificationPromise() {
    this.getUserData();
    var obj = { companyid: this.userData.companyid, logininfoid: this.userData.logininfoid};
    var url = this.baseUrl + "api/notification/CountOfDashboardNotification";
    return this.http.post<any>(url, obj);
  }

  customerNotificationListPromise() {
    this.getUserData();
    var obj = { companyid: this.userData.companyid, customerinfoid: this.userData.customerinfoid };
    var url = this.baseUrl + "api/notification/LoadCustomerNotificationList";
    return this.http.post<any>(url, obj);
  }

  customerNotificationClearAllPromise() {
    this.getUserData();
    var obj = { companyid: this.userData.companyid, customerinfoid: this.userData.customerinfoid};
    var url = this.baseUrl + "api/notification/ClearAllCustomerNotification";
    return this.http.post<any>(url, obj);
  }

  customerNotificationDeletePromise(data) {
    this.getUserData();
    data.companyid = this.userData.companyid;
    data.customerinfoid = this.userData.customerinfoid;
    var url = this.baseUrl + "api/notification/ClearCustomerNotificationById";
    return this.http.post<any>(url, data);
  }

  loadAllCustomerNotificationListPromise() {
    this.getUserData();
    var obj = { companyid: this.userData.companyid, customerinfoid: this.userData.customerinfoid };
    var url = this.baseUrl + "api/notification/CustomerDashboardNotificationList";
    return this.http.post<any>(url, obj);
  }

  loadCustomerCountofNotificationPromise() {
    this.getUserData();
    var obj = { companyid: this.userData.companyid, customerinfoid: this.userData.customerinfoid };
    var url = this.baseUrl + "api/notification/CountOfCustomerDashboardNotification";
    return this.http.post<any>(url, obj);
  }

  getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }

 changepasswordAddPromise(param) {
   this.getUserData();
   param.logininfoid = this.userData.logininfoid
   param.companyid = this.userData.companyid;
   var url = this.baseUrl + "api/user/ChangeUserPassword";
    return this.http.post<any>(url, param);
  }

  loadMixedBarchartDetailsPromise() {
    this.getUserData();
    var obj = { companyid: this.userData.companyid };
    var url = this.baseUrl + "api/admindashboard/LoadInvoiceDataChart";
    return this.http.post<any>(url, obj);
  }


  loadBarchartDetailsPromise() {
    this.getUserData();
    var obj = { companyid: this.userData.companyid };
    var url = this.baseUrl + "api/admindashboard/LoadInvoicesForChart";
    return this.http.post<any>(url, obj);
  }
}
