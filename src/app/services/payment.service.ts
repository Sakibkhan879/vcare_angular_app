import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  userData: any = {};
  yearData: any = {};


  constructor(private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {
 

  }


  paymentsmadeAddPromise(param) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    param.companyid = this.userData.companyid;
    param.financialyearid = this.yearData;
    var url = this.baseUrl + "api/purchasepayment/CreateNewPurchasePayment";
    return this.http.post<any>(url, param);
  }


  paymentsmadeListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { companyid: this.userData.companyid, financialyearid :this.yearData };
    var url = this.baseUrl + "api/purchasepayment/LoadPurchasePaymentList";
    return this.http.post<any>(url, obj);
  }


  paymentsmadeLoadDetailsPromise(data) {
    this.getUserData();
    var obj = { billpaymentmasterid: data, companyid: this.userData.companyid };
    var url = this.baseUrl + "api/purchasepayment/LoadPurchasePaymentDetailsById";
    return this.http.post<any>(url, obj);
  }


  paymentsmadeUpdatePromise(data) {
    var url = this.baseUrl + "api/purchasepayment/UpdatePurchasePayment";
    return this.http.post<any>(url, data);
  }


  paymentsmadeDeletePromise(data) {
    var url = this.baseUrl + "api/purchasepayment/RemovePurchasePayment";
    return this.http.post<any>(url, data);
  }

  //----------------------------payement received--------------------------------


  paymentAddPromise(param) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    param.companyid = this.userData.companyid;
    param.financialyearid = this.yearData;
    var url = this.baseUrl + "api/Payment/CreateNewPayment";
    return this.http.post<any>(url, param);
  }


  paymentListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = {financialyearid: this.yearData };
    var url = this.baseUrl + "api/Payment/LoadAllPaymentLists";
    return this.http.post<any>(url,obj);
  }


  paymentLoadDetailsPromise(data) {
    this.getUserData();
    var obj = { paymentmasterid: data };
    var url = this.baseUrl + "api/Payment/LoadPaymentsDetailsById";
    return this.http.post<any>(url, obj);
  }


  paymentUpdatePromise(data) {
    var url = this.baseUrl + "api/Payment/UpdatePaymentDetailsById";
    return this.http.post<any>(url, data);
  }


  paymentDeletePromise(data) {
    var url = this.baseUrl + "api/Payment/RemovePaymentDetailsById";
    return this.http.post<any>(url, data);
  }

  getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }

  paymenthistoryAddPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { companyid: this.userData.companyid, customerinfoid: this.userData.customerinfoid, financialyearid: this.yearData };
    var url = this.baseUrl + "api/invoicepayment/LoadInvoicePaymentListForCustomerPortal";
    return this.http.post<any>(url,obj);
  }


}



