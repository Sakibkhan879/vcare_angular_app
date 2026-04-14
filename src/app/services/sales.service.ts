import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  userData: any = {};
  yearData: any = {};

  constructor(private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {

  }
  salesBillListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { financialyearid: this.yearData };
    var url = this.baseUrl + "api/SalesBill/SalesBillList";
    return this.http.post<any>(url, obj);
  }

  customerSalesLoadDetailsPromise(data) {
    var obj = { customerinfoid: data };
    var url = this.baseUrl + "api/SalesBill/CustomerPaymentSalesBill";
    return this.http.post<any>(url, obj);
  }

  CustomerPaymentBillPromise(data) {
    var obj = { salesmasterid: data };
    var url = this.baseUrl + "api/SalesBill/CustomerPaymentSalesBill";
    return this.http.post<any>(url, obj);
  }
  orderAddPromise(param) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    param.companyid = this.userData.companyid;
    param.orderbyid = this.userData.logininfoid;
    param.financialyearid = this.yearData;
    var url = this.baseUrl + "api/salesorder/CreateNewSalesOrder";
    return this.http.post<any>(url, param);
  }


  orderListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { companyid: this.userData.companyid, financialyearid: this.yearData };
    var url = this.baseUrl + "api/salesorder/LoadSalesOrderList";
    return this.http.post<any>(url, obj);
  }


  orderLoadDetailsPromise(data) {
    var obj = { salesmasterid: data };
    var url = this.baseUrl + "api/salesorder/FetchSalesOrderDetailsById";
    return this.http.post<any>(url, obj);
  }


  orderUpdatePromise(obj) {
    var url = this.baseUrl + "api/salesorder/UpdateSalesOrderDetails";
    return this.http.post<any>(url, obj);
  }


  orderDeletePromise(data) {
    var url = this.baseUrl + "api/salesorder/RemoveSalesOrder";
    return this.http.post<any>(url, data);
  }

  orderListforPaymentPromise(data) {
    this.getUserData();
    var obj = { companyid: this.userData.companyid, customerinfoid: data.customerinfoid };
    var url = this.baseUrl + "";
    return this.http.post<any>(url, obj);
  }

  approveSalesOrderPromise(data) {
    var url = this.baseUrl + "api/salesorder/MarkAsApproved";
    return this.http.post<any>(url, data);
  }

  getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }

  customerorderListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { companyid: this.userData.companyid, customerinfoid: this.userData.customerinfoid, financialyearid: this.yearData };
    var url = this.baseUrl + "api/salesorder/LoadSalesOrderListForCustomerPortal";
    return this.http.post<any>(url, obj);
  }


  convertToInvoiceandDelivery(data) {
    var obj = { salesmasterid: data.salesmasterid, isinvoiced: data.isinvoiced, isdeliverychallan: data.isdeliverychallan };
    var url = this.baseUrl + "api/salesorder/ConvertToInvoiceOrDelivery";
    return this.http.post<any>(url, obj);
  }
}
