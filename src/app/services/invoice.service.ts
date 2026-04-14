import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  userData: any = {};
  yearData: any = {};

  constructor(private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {

  }

  invoiceAddPromise(param) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    param.financialyearid = this.yearData;
    var url = this.baseUrl + "api/Invoice/CreateNewInvoiceDetails";
    return this.http.post<any>(url, param);
  }


  invoiceListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = {  financialyearid: this.yearData };
    var url = this.baseUrl + "api/Invoice/LoadAllInvoiceLists";
    return this.http.post<any>(url, obj);
  }


  invoiceLoadDetailsPromise(data) {
    var obj = { invoicemasterid: data};
    var url = this.baseUrl + "api/Invoice/LoadInvoiceDetailsById";
    return this.http.post<any>(url, obj);
  }
  paymentInvoiceLoadDetailsPromise(data) {
    var obj = { invoicemasterid: data};
    var url = this.baseUrl + "api/Invoice/LoadInvoiceDetailsById";
    return this.http.post<any>(url, obj);
  }


  invoiceUpdatePromise(obj) {
    var url = this.baseUrl + "api/Invoice/UpdateInvoiceDetailsById";
    return this.http.post<any>(url, obj);
  }


  invoiceDeletePromise(data) {
    var url = this.baseUrl + "api/Invoice/RemoveInvoiceDetailsById";
    return this.http.post<any>(url, data);
  }

  invoiceListforPaymentPromise(data) {
    this.getUserData();
    var obj = { customerinfoid: data };
    var url = this.baseUrl + "api/Invoice/LoadAllCustomerInoviceListForPayment";
    return this.http.post<any>(url, obj);
  }

  estimateAddPromise(param) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    param.companyid = this.userData.companyid;
    param.financialyearid = this.yearData;
    var url = this.baseUrl + "api/estimate/CreateNewEstimate";
    return this.http.post<any>(url, param);
  }


  estimateListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { companyid: this.userData.companyid, financialyearid: this.yearData };
    var url = this.baseUrl + "api/estimate/LoadEstimateList";
    return this.http.post<any>(url, obj);
  }

  estimateDeletePromise(data) {
    var url = this.baseUrl + "api/estimate/RemoveEstimate";
    return this.http.post<any>(url, data);
  }

  estimateUpdatePromise(obj) {
    var url = this.baseUrl + "api/estimate/UpdateEstimateDetails";
    return this.http.post<any>(url, obj);
  }


  estimateLoadDetailsPromise(data) {
    var obj = { estimatemasterid: data };
    var url = this.baseUrl + "api/estimate/FetchEstimateDetailsById";
    return this.http.post<any>(url, obj);
  }

  confirmEstimatePromise(data) {

    var url = this.baseUrl + "api/estimate/ConfirmEstimateById";
    return this.http.post<any>(url, data);
  }

  invoiceListforCreditPromise(data) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { companyid: this.userData.companyid, customerinfoid: data.customerinfoid , financialyearid: this.yearData };
    var url = this.baseUrl + "api/invoice/LoadInvoiceListForCredit";
    return this.http.post<any>(url, obj);
  }

  getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }

  invoicehistoryAddPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { companyid: this.userData.companyid, customerinfoid: this.userData.customerinfoid, financialyearid: this.yearData };
    var url = this.baseUrl + "api/invoice/LoadInvoiceListForCustomerPortal";
    return this.http.post<any>(url, obj);
  }

  getInvoiceList(param) {
    var obj = { columndomain: param };
    var url = this.baseUrl + "api/product/MapColumnName";
    return this.http.post<any>(url, obj);

  }

  submitInvoicePromise(data) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    data.financialyearid = this.yearData;
    data.companyid = this.userData.companyid;
    var url = this.baseUrl + "api/invoice/UploadSalesData";
    return this.http.post<any>(url, data);
  }
}
