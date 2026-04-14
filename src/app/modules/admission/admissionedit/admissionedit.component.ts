import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdmissionService } from '../../../services/admission.service';
import { UtilityService } from '../../../services/utility.service';
@Component({
  selector: 'app-admissionEdit',
  templateUrl: './admissionedit.component.html',
  styleUrls: ['./admissionedit.component.css']
})
export class AdmissioneditComponent implements AfterViewInit {
  Admissionid: any;
  Companyid: any;
  salutaionidList: any[] = [];
  paymentTermList: any[] = [];
  billingStateList: any[] = [];
  shippingStateList: any[] = [];



  admissionEditDetails: any = { }

  constructor(private _router: Router,
    private route: ActivatedRoute,
    private customerService: AdmissionService,
    private toastr: ToastrService,
    public cdr: ChangeDetectorRef,
    private utilityService: UtilityService, 
    private admissionService: AdmissionService)
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

  admissionEditData(form: NgForm) {
    if (form.valid) {
      var addProm = this.admissionService.admissionUpdatePromise(this.admissionEditDetails)
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
    console.log(this.admissionEditDetails);

  }

 
 
  ngAfterViewInit() {
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.Admissionid = params.admissionid;
        this.customerLoadDetails();
      })
  }


  trackAddress() {
    this.admissionEditDetails.sameasbillingaddress = !this.admissionEditDetails.sameasbillingaddress;

    if (this.admissionEditDetails.sameasbillingaddress == true) {
      this.admissionEditDetails.shippingstateid = this.admissionEditDetails.billingstateid;
      this.admissionEditDetails.shippingstatename = this.admissionEditDetails.billingstatename;
      this.admissionEditDetails.shippingcity = this.admissionEditDetails.billingcity;
      this.admissionEditDetails.shippingpostalcode = this.admissionEditDetails.billingpostalcode;
      this.admissionEditDetails.shippingphoneno = this.admissionEditDetails.billingphoneno;
      this.admissionEditDetails.shipppingfaxno = this.admissionEditDetails.billingfaxno;
      this.admissionEditDetails.shippingaddressline1 = this.admissionEditDetails.billingaddressline1;
      this.admissionEditDetails.shippingaddressline2 = this.admissionEditDetails.billingaddressline2;
    }
    else
    {
      this.admissionEditDetails.shippingstateid = null;
      this.admissionEditDetails.shippingstatename ="";
      this.admissionEditDetails.shippingcity = "";
      this.admissionEditDetails.shippingpostalcode = "";
      this.admissionEditDetails.shippingphoneno = "";
      this.admissionEditDetails.shipppingfaxno = "";
      this.admissionEditDetails.shippingaddressline1 = "";
      this.admissionEditDetails.shippingaddressline2 = "";
    }
  }


  blurTrackAddress() {
    this.admissionEditDetails.shippingstateid = this.admissionEditDetails.billingstateid;
    this.admissionEditDetails.shippingstatename = this.admissionEditDetails.billingstatename;
    this.admissionEditDetails.shippingcity = this.admissionEditDetails.billingcity;
    this.admissionEditDetails.shippingpostalcode = this.admissionEditDetails.billingpostalcode;
    this.admissionEditDetails.shippingphoneno = this.admissionEditDetails.billingphoneno;
    this.admissionEditDetails.shipppingfaxno = this.admissionEditDetails.billingfaxno;
    this.admissionEditDetails.shippingaddressline1 = this.admissionEditDetails.billingaddressline1;
    this.admissionEditDetails.shippingaddressline2 = this.admissionEditDetails.billingaddressline2;
    this.cdr.detectChanges();
  }

  customerLoadDetails() 
  {

    var loadProm = this.admissionService.admissionLoadDetailsPromise(this.Admissionid)
    loadProm.subscribe(result => {
      if (result && result.status && result.data && result.data.length > 0) {
        this.admissionEditDetails = result.data[0];
        console.log(result.data,'result');
        this.cdr.markForCheck();
      }

    })

  }

  cancel() {
    this._router.navigate(['app/admission']);
  }
}
