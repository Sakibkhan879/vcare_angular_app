import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  userData: any = {};
  yearData: any = {};

  constructor(private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {
  }


  expenseAddPromise(param) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    param.financialyearid = this.yearData;
    param.companyid = this.userData.companyid;
    var url = this.baseUrl + "api/expense/CreateNewExpense";
    return this.http.post<any>(url, param);
  }


  expenseListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { companyid: this.userData.companyid, financialyearid: this.yearData };
    var url = this.baseUrl + "api/expense/LoadExpenseList";
    return this.http.post<any>(url, obj);
  }

  expenseLoadDetailsPromise(data) {
    this.getUserData();
    var obj = { expensemasterid: data, companyid: this.userData.companyid };
    var url = this.baseUrl + "api/expense/LoadExpenseDetailsById";
    return this.http.post<any>(url, obj);
  }

  expenseUpdatePromise(obj) {
    var url = this.baseUrl + "api/expense/UpdateExpenseDetails";
    return this.http.post<any>(url, obj);
  }

  expenseDeletePromise(data) {
    var url = this.baseUrl + "api/expense/RemoveExpense";
    return this.http.post<any>(url, data);
  }

  loadExpensenameListPromise() {
    this.getUserData();
    var obj = { companyid: this.userData.companyid};
    var url = this.baseUrl + "api/expense/LoadExpenseAccountList";
    return this.http.post<any>(url, obj);
  }

  addExpenseAccountnamePromise(param) {
    this.getUserData();
    param.companyid= this.userData.companyid;
    var url = this.baseUrl + "api/expense/CreateNewExpenseAccount";
    return this.http.post<any>(url, param);
  }

  getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }
}
