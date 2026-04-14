import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../../services/customer.service';
import { UtilityService } from '../../../services/utility.service';
@Component({
  selector: 'app-customerEdit',
  templateUrl: './customeredit.component.html'
})
export class CustomereditComponent implements AfterViewInit {
  Customerinfoid: any;
  Companyid: any;
  salutaionidList: any[] = [];
  paymentTermList: any[] = [];
  billingStateList: any[] = [];
  shippingStateList: any[] = [];



  customerEditDetails: any = { }

  constructor(private _router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private toastr: ToastrService,
    public cdr: ChangeDetectorRef,
    private utilityService: UtilityService)
  {
    this.loadStateWebSetting();
    this.loadSalutaionidWebSetting();
    this.loadPaymenttermWebSetting();
  }

  loadStateWebSetting() {
    shippingStateList: [] = [];
    var stateShippingProm = this.utilityService.getWebSettingByDomainPromise('STATE');
    stateShippingProm.subscribe(result => {
      this.shippingStateList = result.data;
    });
    billingStateList: [] = [];
    var stateBillingProm = this.utilityService.getWebSettingByDomainPromise('STATE');
    stateBillingProm.subscribe(result => {
      this.billingStateList = result.data;
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

  loadPaymenttermWebSetting() {
    paymentTermList: [] = [];
    var paymenttermProm = this.utilityService.getWebSettingByDomainPromise('PAYMENT_TERM');
    paymenttermProm.subscribe(result => {
      this.paymentTermList = result.data;
      console.log(result.data);
    });
  }

  customerEditData(form: NgForm) {
    if (form.valid) {
      var addProm = this.customerService.customerUpdatePromise(this.customerEditDetails)
      addProm.subscribe(result => {
        if (result && result.status && result.data) {
          console.log(result);
          this.toastr.success(result.message);
          location.reload();
        }
        else {

          this.toastr.error(result.message);
        }
      })
    }
    else {
      this.toastr.error("Please enter all mandatory fields with proper information!");
    }
    console.log(this.customerEditDetails);

  }

 
 
  ngAfterViewInit() {
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.Customerinfoid = params.customerinfoid;
        this.customerLoadDetails();
      })
  }


  trackAddress() {
    this.customerEditDetails.sameasbillingaddress = !this.customerEditDetails.sameasbillingaddress;

    if (this.customerEditDetails.sameasbillingaddress == true) {
      this.customerEditDetails.shippingstateid = this.customerEditDetails.billingstateid;
      this.customerEditDetails.shippingstatename = this.customerEditDetails.billingstatename;
      this.customerEditDetails.shippingcity = this.customerEditDetails.billingcity;
      this.customerEditDetails.shippingpostalcode = this.customerEditDetails.billingpostalcode;
      this.customerEditDetails.shippingphoneno = this.customerEditDetails.billingphoneno;
      this.customerEditDetails.shipppingfaxno = this.customerEditDetails.billingfaxno;
      this.customerEditDetails.shippingaddressline1 = this.customerEditDetails.billingaddressline1;
      this.customerEditDetails.shippingaddressline2 = this.customerEditDetails.billingaddressline2;
    }
    else
    {
      this.customerEditDetails.shippingstateid = null;
      this.customerEditDetails.shippingstatename ="";
      this.customerEditDetails.shippingcity = "";
      this.customerEditDetails.shippingpostalcode = "";
      this.customerEditDetails.shippingphoneno = "";
      this.customerEditDetails.shipppingfaxno = "";
      this.customerEditDetails.shippingaddressline1 = "";
      this.customerEditDetails.shippingaddressline2 = "";
    }
  }


  blurTrackAddress() {
    this.customerEditDetails.shippingstateid = this.customerEditDetails.billingstateid;
    this.customerEditDetails.shippingstatename = this.customerEditDetails.billingstatename;
    this.customerEditDetails.shippingcity = this.customerEditDetails.billingcity;
    this.customerEditDetails.shippingpostalcode = this.customerEditDetails.billingpostalcode;
    this.customerEditDetails.shippingphoneno = this.customerEditDetails.billingphoneno;
    this.customerEditDetails.shipppingfaxno = this.customerEditDetails.billingfaxno;
    this.customerEditDetails.shippingaddressline1 = this.customerEditDetails.billingaddressline1;
    this.customerEditDetails.shippingaddressline2 = this.customerEditDetails.billingaddressline2;
    this.cdr.detectChanges();
  }

  customerLoadDetails() 
  {

    var loadProm = this.customerService.customerLoadDetailsPromise(this.Customerinfoid)
    loadProm.subscribe(result => {
      if (result && result.status && result.data && result.data.length > 0) {
        this.customerEditDetails = result.data[0];
        console.log(result.data,'result');
        this.cdr.markForCheck();
      }

    })

  }

  cancel() {
    this._router.navigate(['app/customer']);
  }
}
