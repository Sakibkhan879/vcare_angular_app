import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  userData: any = {};
  yearData: any = {};


  constructor(private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {
 
  }
  registerPromise(param) {

  }

  dashboardLoadDetailsPromise(param) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    param.financialyearid = this.yearData;
    var url = this.baseUrl + "api/AdminDashboard/LoadAdminData";
    return this.http.post<any>(url, param);
  }


  dashboardUpdatePromise(obj) {
    var url = this.baseUrl + "api/user/UpdateAdminDetails";
    return this.http.post<any>(url, obj);
  }

  myprofileLoadDetailsPromise() {
    this.getUserData();
    var obj = { admininfoid: this.userData.admininfoid };
    //param.admininfoid = this.userData.admininfoid;
    var url = this.baseUrl + "api/user/LoadAdminDetailsById";
    return this.http.post<any>(url, obj);
  }

  getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }


  customerprofileLoadDetailsPromise() {
    this.getUserData();
    var obj = { customerinfoid: this.userData.customerinfoid};
    var url = this.baseUrl + "api/user/LoadCustomerDetailsById";
    return this.http.post<any>(url, obj);
  }


}
