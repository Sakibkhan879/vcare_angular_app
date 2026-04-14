import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BillService {
  userData: any = {};
  yearData: any = {};


  constructor(private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {


  }


  billAddPromise(param) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    param.companyid = this.userData.companyid;
    param.financialyearid = this.yearData;
    var url = this.baseUrl + "api/bill/CreateNewBill";
    return this.http.post<any>(url, param);
  }


  billListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { companyid: this.userData.companyid, financialyearid: this.yearData };
    var url = this.baseUrl + "api/bill/LoadBillList";
    return this.http.post<any>(url, obj);
  }


  billLoadDetailsPromise(data) {
    var obj = { billmasterid: data};
    var url = this.baseUrl + "api/bill/LoadBillDetailsById";
    return this.http.post<any>(url, obj);
  }


  billUpdatePromise(obj) {
    var url = this.baseUrl + "api/bill/UpdateBillDetails";
    return this.http.post<any>(url, obj);
  }

  billDeletePromise(data) {
    var url = this.baseUrl + "api/bill/RemoveBill";
    return this.http.post<any>(url, data);
  }


  billListforPaymentPromise(data) {
    this.getUserData();
    var obj = { companyid: this.userData.companyid, vendorinfoid: data.vendorinfoid};
    var url = this.baseUrl + "api/bill/LoadBillListForPayment";
    return this.http.post<any>(url, obj);
  }


  billListforDebitPromise(data) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { companyid: this.userData.companyid, vendorinfoid: data.vendorinfoid, financialyearid: this.yearData };
    var url = this.baseUrl + "api/bill/LoadBillListForDebit";
    return this.http.post<any>(url, obj);
  }

  getBillList(param) {
    var obj = { columndomain: param };
    var url = this.baseUrl + "api/product/MapColumnName";
    return this.http.post<any>(url, obj);

  }

  submitBillPromise(data) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    data.financialyearid = this.yearData;
    data.companyid = this.userData.companyid;
    var url = this.baseUrl + "api/bill/UploadPurchaseData";
    return this.http.post<any>(url, data);
  }


  addExcelDataPromise(param) {  
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    param.companyid = this.userData.companyid;
    param.financialyearid = this.yearData;
    var url = this.baseUrl + "api/excel/AddExcelData";
    return this.http.post<any>(url, param);
  }

  getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }
  
}
