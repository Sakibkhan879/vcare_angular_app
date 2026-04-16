import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UtilityService {

   userData: any = {};
  public newDate: Date = new Date();

  constructor(private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {
    }

  getWebSettingByDomainPromise(param) {
    var obj = {domain:param};
    var url = this.baseUrl + "api/websettings/WebsettingList";
    return this.http.post<any>(url, obj);
  }
  LoadAcademicYearList(param) {
    var obj = { domain: param };
    var url = this.baseUrl + "api/websettings/LoadAcademicYearList";
    return this.http.post<any>(url,obj);
  }

  getStaffWebSettingPromise(param) {
    var obj = { userroletype: param };
    var url = this.baseUrl + "api/websettings/UserRoleList";
    return this.http.post<any>(url, obj);
  }

  getExpenseSettingByDomainPromise(param) {
    var obj = { EXPENSE :param };
    var url = this.baseUrl + "api/websettings/WebsettingList";
    return this.http.post<any>(url, obj);
  }

  getPrioritySettingByDomainPromise(param) {
    var obj = { domain: param };
    var url = this.baseUrl + "api/websettings/WebsettingList";
    return this.http.post<any>(url, obj);
  }

  AddDaystoDate(_date,days) {
    this.newDate = _date;
    var dueDate = new Date(this.newDate.setDate(this.newDate.getDate() + days));
    return dueDate;   
  }

  base64ToArrayBuffer(base64): Uint8Array {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  }

  
  getSearchForListPromise(param) {
    var obj = { reportdomain: param };
    var url = this.baseUrl + "api/report/ReportList ";
    return this.http.post<any>(url, obj);
  }

  checkPageRouteAccess(param) {
    this.getUserData();
    var obj = { pagename: param ,loginmasterid:  this.userData.logininfoid}; 
    var url = this.baseUrl + "api/Role/GrantAccess ";
    return this.http.post<any>(url, obj);
  }

  getAccessData() {
    var url = this.baseUrl + "api/user/FetchAccessData ";
    return this.http.post<any>(url, {});
  }

  getTimeStamp() {
    return new Date().getTime().toString();
  }

    LoadAllCompanyList(param){
    var url = this.baseUrl +"api/WebSettings/LoadAllCompanyList";
    return this.http.post<any>(url,param)
  }

getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }

}
