import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class VendorService {
  userData: any = {};
  yearData: any = {};

  constructor(private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {

  }


  vendorAddPromise(param) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    param.financialyearid = this.yearData;
    var url = this.baseUrl + "api/Vendor/CreateNewVendor";
    return this.http.post<any>(url, param);
  }


  vendorListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { companyid: this.userData.companyid, financialyearid: this.yearData };
    var url = this.baseUrl + "api/Vendor/LoadAllVendorLists";
    return this.http.post<any>(url, obj);
  }


  vendorLoadDetailsPromise(data) {
    this.getUserData();
    var obj = { vendorinfoid: data, companyid: this.userData.companyid };
    var url = this.baseUrl + "api/Vendor/LoadVendorDetailsById";
    return this.http.post<any>(url, obj);
  }


  vendorUpdatePromise(obj) {
    var url = this.baseUrl + "api/Vendor/UpdateVendorDetailsById";
    return this.http.post<any>(url, obj);
  }


  vendorDeletePromise(data) {

    var url = this.baseUrl + "api/Vendor/RemoveVendorDetailsById";
    return this.http.post<any>(url, data);
  }

  /*  -----------*****---------Vendor purchase-----------*/


  vendorPurchaseAddPromise(param) {
    this.getUserData();
    param.companyid = this.userData.companyid;
    this.yearData = localStorage["yeardata"];
    param.financialyearid = this.yearData;
    var url = this.baseUrl + "api/Vendor/CreateNewVendorPurchase";
    return this.http.post<any>(url, param);
  }


  vendorPurchaseListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = {  financialyearid: this.yearData };
    var url = this.baseUrl + "api/Vendor/LoadAllVendorPurchase";
    return this.http.post<any>(url, obj);
  }


  vendorPurchaseLoadDetailsPromise(data) {
    this.getUserData();
    var obj = { vendorpurchasemasterid: data };
    var url = this.baseUrl + "api/Vendor/LoadVendorPurchaseDetailsById";
    return this.http.post<any>(url, obj);
  }


  vendorPurchaseUpdatePromise(obj) {
    var url = this.baseUrl + "api/Vendor/UpdateVendorPurchaseById";
    return this.http.post<any>(url, obj);
  }


  vendorPurchaseDeletePromise(data) {

    var url = this.baseUrl + "api/Vendor/RemoveVendorPruchaseById";
    return this.http.post<any>(url, data);
  }


  //-----------------Vendor Payment ---------------------------

  vendorPaymentAddPromise(param) {
    this.getUserData();
    param.companyid = this.userData.companyid;
    this.yearData = localStorage["yeardata"];
    param.financialyearid = this.yearData;
    var url = this.baseUrl + "api/Vendor/CreateNewVendorPayment";
    return this.http.post<any>(url, param);
  }


  vendorPaymentListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = {  financialyearid: this.yearData };
    var url = this.baseUrl + "api/Vendor/LoadAllVendorPaymentLists";
    return this.http.post<any>(url, obj);
  }


  vendorPaymentLoadDetailsPromise(data) {
    this.getUserData();
    var obj = { vendorpaymentmasterid: data };
    var url = this.baseUrl + "api/Vendor/LoadVendorPaymentDetailsById";
    return this.http.post<any>(url, obj);
  }


  vendorPaymentUpdatePromise(obj) {
    var url = this.baseUrl + "api/Vendor/UpdateVendorPaymentById";
    return this.http.post<any>(url, obj);
  }


  vendorPaymentDeletePromise(data) {
    var url = this.baseUrl + "api/Vendor/RemoveVendorPaymentById";
    return this.http.post<any>(url, data);
  }

  vendorBillListPromise(data) {
    this.getUserData();
    var obj = { vendorinfoid: data };
    var url = this.baseUrl + "api/Vendor/LoadAllVendorPurchaseByVendorInfoId";
    return this.http.post<any>(url, obj);
  }


  vendorListforBillPromise() {
    this.getUserData();
    var obj = { companyid: this.userData.companyid };
    var url = this.baseUrl + "api/Vendor/LoadAllVendorLists";
    return this.http.post<any>(url, obj);
  }

  getVendorList(param) {
    var obj = { columndomain: param };
    var url = this.baseUrl + "api/product/MapColumnName";
    return this.http.post<any>(url, obj);

  }

  submitVendorPromise(data) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    data.financialyearid = this.yearData;
    data.companyid = this.userData.companyid;
    var url = this.baseUrl + "api/user/UploadVendorData";
    return this.http.post<any>(url, data);
  }

  getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }
}
