import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UtilityService } from '../../../services/utility.service';
import { AdmissionService } from '../../../services/admission.service';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';
import { SubscriptionService } from '../../../services/subscription.service';

@Component({
  selector: 'app-admissionadd',
  templateUrl: './admissionadd.component.html',
  styleUrls: ['./admissionadd.component.css']
})
export class AdmissionaddComponent {

  salutaionidList: any[] = [];
  paymentTermList: any[] = [];
  billingStateList: any[] = [];
  shippingStateList: any[] = [];

  admissionAddDetails: any = {
    admissiontypecode: "BUSINESS", sameasbillingaddress: false}


  constructor(private _router: Router,
    private cdr: ChangeDetectorRef, 
    private utilityService: UtilityService,
    private admissionService: AdmissionService,
    private subscriptionService: SubscriptionService,
    private toastr: ToastrService) {
    this.loadStateWebSetting();
    this.loadSalutaionidWebSetting();
    this.loadPaymenttermWebSetting();
  }


  customerAddData(form: NgForm)
  {


    this.admissionAddDetails.adminpassword = this.admissionAddDetails.admissionmobileno;

    if (form.valid ) {
      var addProm = this.admissionService.admissionAddPromise(this.admissionAddDetails)
      addProm.subscribe(result => {
        if (result && result.status && result.data) {
          console.log(result);
          this.toastr.success(result.message);

          for (let key in form.controls) {
            if (key != "admissiontypecode") {
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
    console.log(this.admissionAddDetails);

  }

  changeAdmissionType(data) {
    this.admissionAddDetails.admissiontypecode = data;
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
    this.admissionAddDetails.sameasbillingaddress = !this.admissionAddDetails.sameasbillingaddress;
    if (this.admissionAddDetails.sameasbillingaddress == true) {
      this.admissionAddDetails.shippingstateid = this.admissionAddDetails.billingstateid;
      this.admissionAddDetails.shippingstatename = this.admissionAddDetails.billingstatename;
      this.admissionAddDetails.shippingcity = this.admissionAddDetails.billingcity;
      this.admissionAddDetails.shippingpostalcode = this.admissionAddDetails.billingpostalcode;
      this.admissionAddDetails.shippingphoneno = this.admissionAddDetails.billingphoneno;
      this.admissionAddDetails.shipppingfaxno = this.admissionAddDetails.billingfaxno;
      this.admissionAddDetails.shippingaddressline1 = this.admissionAddDetails.billingaddressline1;
      this.admissionAddDetails.shippingaddressline2 = this.admissionAddDetails.billingaddressline2;
      this.cdr.detectChanges();
    }
    else {
      this.admissionAddDetails.shippingstateid = null;
      this.admissionAddDetails.shippingstatename ="";
      this.admissionAddDetails.shippingcity = "";
      this.admissionAddDetails.shippingpostalcode = "";
      this.admissionAddDetails.shippingphoneno = "";
      this.admissionAddDetails.shipppingfaxno = "";
      this.admissionAddDetails.shippingaddressline1 = "";
      this.admissionAddDetails.shippingaddressline2 = "";
    }    
  }

  blurTrackAddress() {
    if (this.admissionAddDetails.sameasbillingaddress == true) {
      this.admissionAddDetails.shippingstateid = this.admissionAddDetails.billingstateid;
      this.admissionAddDetails.shippingstatename = this.admissionAddDetails.billingstatename;
      this.admissionAddDetails.shippingcity = this.admissionAddDetails.billingcity;
      this.admissionAddDetails.shippingpostalcode = this.admissionAddDetails.billingpostalcode;
      this.admissionAddDetails.shippingphoneno = this.admissionAddDetails.billingphoneno;
      this.admissionAddDetails.shipppingfaxno = this.admissionAddDetails.billingfaxno;
      this.admissionAddDetails.shippingaddressline1 = this.admissionAddDetails.billingaddressline1;
      this.admissionAddDetails.shippingaddressline2 = this.admissionAddDetails.billingaddressline2;
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
    this._router.navigate(['app/admission']);
  }
}
