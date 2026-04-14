import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
declare var $;

@Injectable({
  providedIn: 'root'
})
export class BizBotService {

  userData: any = {};
  customerData: any = {};

  constructor(private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {
  }


  getInitalChatSetup() {
    this.getUserData();
    var data = { companyid: this.userData.companyid }
    var url = this.baseUrl + "api/bizbot/FetchBotStartFlow";
    return this.http.post<any>(url, data);
  }

  companyChatBotTransaction(data, url) {
    this.getUserData();
    if (!data.additionalinfo) {
      data.additionalinfo = {}; 
    }
    data.additionalinfo.companyid = this.userData.companyid;
    data.additionalinfo.financialyearid = localStorage["yeardata"];
    var urlfinal = this.baseUrl + "api/" + url;
    return  $.ajax({
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
