import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
declare var $;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userData: any = {};
  customerData: any = {};

  constructor(private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {
  }
  loginPromise(param) {
    var url = this.baseUrl + "api/User/Login";
    return this.http.post<any>(url, param);
  }

  customerloginPromise(param) {
    //this.getUserData();
   // param.companyid = this.userData.companyid;
    this.getCustomerData();
    param.companyid = this.customerData;
    var url = this.baseUrl + "api/user/CustomerLogin";
    return this.http.post<any>(url, param);
  }

  customerExistCheckloginPromise(param) {
    var url = this.baseUrl + "api/user/CheckCustomerExistsForPortal";
    return this.http.post<any>(url, param);
  }

  adminExistForgetPasswordPromise(param) {
    var url = this.baseUrl + "api/user/CheckCompanyAdminExists";
    return this.http.post<any>(url, param);
  }

  loadSuggestionListPromise() {
   this.getUserData();

    var url = this.baseUrl + "api/suggestion/LoadSuggestionMessageById";
    return this.http.post<any>(url, this.userData);
  }

  markSuggestionUsefulPromise(data) {
    var urlfinal = this.baseUrl + "api/suggestion/MarkSuggestionUseful" ;
    return $.ajax({
      type: 'POST',
      url: urlfinal,
      data: data,
      headers: {
        Authorization: localStorage["stockmtoken"]
      },
      error: (result2) => {
      }
    })
  }

  resetAdminPassword(data) {
    var url = this.baseUrl + "api/user/ResetAdminPassword";
    return this.http.post<any>(url, data);
  }

  getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }

  getCustomerData() {
    if (localStorage["customerdata"]) {
      this.customerData = JSON.parse(localStorage["customerdata"]);
    }
  }

}
