import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  userData: any = {};

  constructor(private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {

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

  getdashboardTypePromise() {
    this.getUserData();
    var obj = { companyid: this.userData.companyid };
    var url = this.baseUrl + "api/admindashboard/LoadDashboardList";
    return this.http.post<any>(url, obj);
  }

  getdashboardChartPromise(data) {
    this.getUserData();
    data.companyid= this.userData.companyid;
    var url = this.baseUrl + "api/admindashboard/LoadChartListById";
    return this.http.post<any>(url, data);
  }

  loadChartDataPromise(data) {
    this.getUserData();
    data.companyid = this.userData.companyid;
    data.financialyearid = localStorage["yeardata"];
    var url = this.baseUrl + "api/admindashboard/LoadChartData";
    return this.http.post<any>(url, data);
  }

  getdashboardKPIPromise(data) {
    this.getUserData();
    data.companyid = this.userData.companyid;
    var url = this.baseUrl + "api/admindashboard/LoadKPIListById";
    return this.http.post<any>(url, data);
  }

  getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }
}
