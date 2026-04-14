import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChallanService {

  userData: any = {};
  yearData: any = {};

  constructor(private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {


  }

  challanAddPromise(param) {
   
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    param.companyid = this.userData.companyid;
    param.financialyearid = this.yearData;
    var url = this.baseUrl + "api/DeliveryChallan/CreateNewChallan";
    return this.http.post<any>(url, param);
  }


  challanListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { financialyearid: this.yearData };
    var url = this.baseUrl + "api/DeliveryChallan/LoadAllChallanList";
    return this.http.post<any>(url, obj);
  }

  customerchallanListPromise(data) {

    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { customerinfoid: data };
    var url = this.baseUrl + "api/DeliveryChallan/LoadAllCustomerChallanList";
    return this.http.post<any>(url, obj);
  }

  challanLoadDetailsPromise(data) {
    this.yearData = localStorage["yeardata"];
    var obj = { challanmasterid: data, financialyearid: this.yearData };
    console.log(obj, 'obj');
    var url = this.baseUrl + "api/DeliveryChallan/LoadChallanDetailsById";
    return this.http.post<any>(url, obj);
  }


  challanLoadDetailsForInvoicePromise(data) {
    this.yearData = localStorage["yeardata"];
    var obj = { challanmasterid: data, financialyearid: this.yearData };
    var url = this.baseUrl + "api/DeliveryChallan/LoadChallanDetailsById";
    return this.http.post<any>(url, obj);
  }


  challanUpdatePromise(obj) {
    this.yearData = localStorage["yeardata"];
     obj.financialyearid = this.yearData ;
    var url = this.baseUrl + "api/DeliveryChallan/UpdateChallanById";
    return this.http.post<any>(url, obj);
  }


  challanDeletePromise(data) {
    var url = this.baseUrl + "api/DeliveryChallan/RemoveChallanMasterById";
    return this.http.post<any>(url, data);
  }

  checkchallanDetailsForDeletePromise(data) {
    var url = this.baseUrl + "api/DeliveryChallan/CheckChallanInInvoice";
    return this.http.post<any>(url, data);
  }
  checkchallanIfExistsPromise(data) {
    var obj = { challanmasterid: data, financialyearid: this.yearData };

    var url = this.baseUrl + "api/DeliveryChallan/CheckChallanInInvoice";
    return this.http.post<any>(url, obj);
  }

  confirmDeliveryChallanPromise(data) {
    var url = this.baseUrl + "api/deliverychallan/ConfirmDeliveryChallan";
    return this.http.post<any>(url, data);
  }

  convertToInvoiceService(data)
  {
    this.yearData = localStorage["yeardata"];
    data.financialyearid = this.yearData;
    var url = this.baseUrl + "api/DeliveryChallan/ConvertToInvoice";
    return this.http.post<any>(url, data);
  }

  getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }
}
