import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSmartModalService } from 'ngx-smart-modal';
@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  userData: any = {};
  yearData: any = {};

  constructor(private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    public ngxSmartModalService: NgxSmartModalService,
    @Inject('BASE_URL') private baseUrl: string,
    @Inject('RAZ_KEY') private razKey: string) {

  }

  getSubscriptionByDomainPromise(param) {
    var obj = { domain: param };
    var url = this.baseUrl + "api/subscription/LoadPlanList";
    return this.http.post<any>(url, obj);
  }

  createNewSubscription(param) {
    var url = this.baseUrl + "api/subscription/CreateNewSubscription";
    return this.http.post<any>(url, param);
  }

  getSubscriptionStatusByDomainPromise() {
    this.getUserData();
    var obj = { companyid: this.userData.companyid };
    var url = this.baseUrl + "api/subscription/CheckSubscriptionStatus";
    return this.http.post<any>(url, obj);
  }

  subscriptionListPromise() {
    this.getUserData();
    var obj = { companyid: this.userData.companyid };
    var url = this.baseUrl + "api/subscription/LoadMySubscription";
    return this.http.post<any>(url, obj);
  }

  newsubscriptionPromise(param) {
    this.getUserData();
    param.companyid = this.userData.companyid;
    var url = this.baseUrl + "api/subscription/CreateSubscriptionForCompany";
    return this.http.post<any>(url,param);
  }

  cancelsubscriptionPromise(param) {
    var url = this.baseUrl + "api/subscription/CancelSubscription";
    return this.http.post<any>(url,param);
  }

  checkSubscriptionLimitPromise(param) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    param.financialyearid = this.yearData;
    param.companyid = this.userData.companyid;
    var url = this.baseUrl + "api/subscription/CheckSubscriptionLimit";
    return this.http.post<any>(url, param);
  }

  getPaymentOrderNo(param) {
    this.getUserData();
    param.logininfoid = this.userData.logininfoid;
    var data = { transactioninfo: param };
    var url = this.baseUrl + "api/subscription/CreateSubscriptionTransaction";
    return this.http.post<any>(url, data);
  }

  createNewPayment(data) {
    var url = this.baseUrl + "api/subscription/CreateSubscriptionPaymentForCompany";
    return this.http.post<any>(url, data);
  }

  testToaster() {
    this.ngxSmartModalService.getModal('paymentSuccessModal').open();
  }

  getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }

  getPaymentOptions(result) {
    var orderid = result.data.order_id;
    const _this = this;
    const _result = result;
    var options = {
      "key": this.razKey, // Enter the Key ID generated from the Dashboard
      "amount": result.data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": result.data.currency,
      "name": "Bizman",
      "description": result.data.description,
      "image": "https://bizman.in/imgs/bizman.png",
      "order_id": orderid, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "handler": function (response) {
        if (response && response.razorpay_order_id && response.razorpay_payment_id) {
          response.transactionmasterid = _result.data.transactionmasterid;
          var paymentProm = _this.createNewPayment(response);
          paymentProm.subscribe(paymentresult => {
            if (paymentresult && paymentresult.status && paymentresult.data && paymentresult.data.transactiono && paymentresult.data.transactiono != "" && paymentresult.data.razorpay_payment_id && paymentresult.data.razorpay_payment_id != "") {
              window.location.reload(); 
              
            }
            else {
              _this.ngxSmartModalService.getModal('paymentFailureModal').open();
            }

          });
        }

      },
      "prefill": {
        "name": result.data.name,
        "email": result.data.email,
        "contact": result.data.contact
      },
      "notes": {
        "address": ""
      },
      "theme": {
        "color": "#3399cc"
      }
    };

    return options;

  }
}
