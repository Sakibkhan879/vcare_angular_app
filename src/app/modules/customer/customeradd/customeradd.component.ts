import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UtilityService } from '../../../services/utility.service';
import { CustomerService } from '../../../services/customer.service';

import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';
import { SubscriptionService } from '../../../services/subscription.service';

@Component({
  selector: 'app-customerAdd',
  templateUrl: './customeradd.component.html'
})
export class CustomeraddComponent {

  salutaionidList: any[] = [];
  paymentTermList: any[] = [];
  billingStateList: any[] = [];
  shippingStateList: any[] = [];

  customerAddDetails: any = {
    customertypecode: "BUSINESS", sameasbillingaddress: false}


  constructor(private _router: Router,
    private cdr: ChangeDetectorRef, 
    private utilityService: UtilityService,
    private customerService: CustomerService,
    private subscriptionService: SubscriptionService,
    private toastr: ToastrService) {
    this.loadStateWebSetting();
    this.loadSalutaionidWebSetting();
    this.loadPaymenttermWebSetting();
  }


  customerAddData(form: NgForm)
  {


    this.customerAddDetails.adminpassword = this.customerAddDetails.customermobileno;

    if (form.valid ) {
      var addProm = this.customerService.customerAddPromise(this.customerAddDetails)
      addProm.subscribe(result => {
        if (result && result.status && result.data) {
          console.log(result);
          this.toastr.success(result.message);

          for (let key in form.controls) {
            if (key != "customertypecode") {
              form.controls[key].reset();
            }

          }


          

        }
        else {
          this.toastr.error(result.message);
        }
      })
    }
    else {
      this.toastr.error("Please enter all mandatory fields with proper information!");
    }
    console.log(this.customerAddDetails);

  }

  changeCustomerType(data) {
    this.customerAddDetails.customertypecode = data;
  }


  loadStateWebSetting()
  {
    shippingStateList: [] = [];

    var stateShippingProm = this.utilityService.getWebSettingByDomainPromise('STATE');
    stateShippingProm.subscribe(result => {
      this.shippingStateList = result.data;
    });

      
   
    var stateBillingProm = this.utilityService.getWebSettingByDomainPromise('STATE');
    stateBillingProm.subscribe(result => {
      this.billingStateList = result.data; 
      console.log(this.billingStateList, 'this.billingStateList');
    });




  }

  loadSalutaionidWebSetting() {
    salutaionidList: [] = [];
    var salutaionidProm = this.utilityService.getWebSettingByDomainPromise('SALUTAION');
    salutaionidProm.subscribe(result => {
      this.salutaionidList = result.data;
      console.log(result.data);
    });
  }

  trackAddress() {
    this.customerAddDetails.sameasbillingaddress = !this.customerAddDetails.sameasbillingaddress;
    if (this.customerAddDetails.sameasbillingaddress == true) {
      this.customerAddDetails.shippingstateid = this.customerAddDetails.billingstateid;
      this.customerAddDetails.shippingstatename = this.customerAddDetails.billingstatename;
      this.customerAddDetails.shippingcity = this.customerAddDetails.billingcity;
      this.customerAddDetails.shippingpostalcode = this.customerAddDetails.billingpostalcode;
      this.customerAddDetails.shippingphoneno = this.customerAddDetails.billingphoneno;
      this.customerAddDetails.shipppingfaxno = this.customerAddDetails.billingfaxno;
      this.customerAddDetails.shippingaddressline1 = this.customerAddDetails.billingaddressline1;
      this.customerAddDetails.shippingaddressline2 = this.customerAddDetails.billingaddressline2;
      this.cdr.detectChanges();
    }
    else {
      this.customerAddDetails.shippingstateid = null;
      this.customerAddDetails.shippingstatename ="";
      this.customerAddDetails.shippingcity = "";
      this.customerAddDetails.shippingpostalcode = "";
      this.customerAddDetails.shippingphoneno = "";
      this.customerAddDetails.shipppingfaxno = "";
      this.customerAddDetails.shippingaddressline1 = "";
      this.customerAddDetails.shippingaddressline2 = "";
    }    
  }

  blurTrackAddress() {
    if (this.customerAddDetails.sameasbillingaddress == true) {
      this.customerAddDetails.shippingstateid = this.customerAddDetails.billingstateid;
      this.customerAddDetails.shippingstatename = this.customerAddDetails.billingstatename;
      this.customerAddDetails.shippingcity = this.customerAddDetails.billingcity;
      this.customerAddDetails.shippingpostalcode = this.customerAddDetails.billingpostalcode;
      this.customerAddDetails.shippingphoneno = this.customerAddDetails.billingphoneno;
      this.customerAddDetails.shipppingfaxno = this.customerAddDetails.billingfaxno;
      this.customerAddDetails.shippingaddressline1 = this.customerAddDetails.billingaddressline1;
      this.customerAddDetails.shippingaddressline2 = this.customerAddDetails.billingaddressline2;
      this.cdr.detectChanges();
    }
  }

  loadPaymenttermWebSetting()
  {
    paymentTermList: [] = [];
    var paymenttermProm = this.utilityService.getWebSettingByDomainPromise('PAYMENT_TERM');
    paymenttermProm.subscribe(result => {
      this.paymentTermList = result.data;
      console.log(result.data);
    });
  }

  cancel() {
    this._router.navigate(['app/customer']);
  }
}
