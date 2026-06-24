import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from '../../../services/payment.service';
import { UtilityService } from '../../../services/utility.service';

@Component({
  selector: 'app-paymentedit',
  templateUrl: './paymentedit.component.html'
})
export class PaymenteditComponent implements OnInit, AfterViewInit {

  paymentmasterid: any;

  PaymentEditDetails: any = {};
  admissionEditDetails: any = {};

  paymentmodeList: any[] = [];
  standardList: any[] = [];
  ratelist: any[] = [];
  feesetupList: any = [];

  companycode: string = "";

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private toastr: ToastrService,
    public cdr: ChangeDetectorRef,
    private utilityService: UtilityService
  ) {

    if (localStorage["companycode"]) {
      this.companycode = localStorage["companycode"];
    }
  }

  ngOnInit() {
    this.loadWebSetting();
  }

  ngAfterViewInit() {

    this.route.queryParams.subscribe(params => {
      if (params.paymentmasterid) {
        this.paymentmasterid = params.paymentmasterid;
        this.loadPaymentDetails();
      }
    });

  }

  loadWebSetting() {

    this.utilityService.getWebSettingByDomainPromise('PAYMENT_MODE').subscribe(result => {
      this.paymentmodeList = result.data;
    });

    this.utilityService.getWebSettingByDomainPromise('STANDARD').subscribe(result => {
      this.standardList = result.data;
    });

    this.utilityService.getWebSettingByDomainPromise('RATE').subscribe(result => {
      this.ratelist = result.data;
    });

  }

  loadPaymentDetails() {

    const loadProm = this.paymentService.paymentLoadDetailsPromise(this.paymentmasterid);
    loadProm.subscribe((result: any) => {       
      this.feesetupList = result.data.Table1;
      if (result && result.status && result.data) {
        this.PaymentEditDetails = result.data[0];              
        this.PaymentEditDetails = result.data.Table[0];
        this.admissionEditDetails.standardid = this.PaymentEditDetails.standardid;
        this.feesetupList = result.data.Table1 || [];
        this.cdr.detectChanges();
      } else {
        this.toastr.error('Failed to load payment details');
      }

    });

  }





  fetchhours() {

    ////if (!this.PaymentAddDetails.fromdate) {
    ////  this.toastr.error('Please select From Date');
    ////  return;
    ////}

    ////if (!this.PaymentAddDetails.todate) {
    ////  this.toastr.error('Please select To Date');
    ////  return;
    ////}

    this.paymentService.LoadLogForPaymentPromise(this.PaymentEditDetails)
      .subscribe(result => {
        if (result && result.status) {
          this.PaymentEditDetails.totalhours =
            result.data.reduce(
              (sum, item) => sum + Number(item.loghours),
              0
            );
          this.toastr.success('Hours fetched successfully');
          this.calculateAmount(); // recalculate amount automatically
        }

      });
  }



  calculateTotal() {

    const sum = this.feesetupList
      .filter(fee => fee.ischecked)
      .reduce((acc, current) => {
        return acc + Number(current.amount);
      }, 0);

    this.PaymentEditDetails.totalamount = sum;

  }

  //fetchhours(form: NgForm) {

  //  if (form.valid) {

  //    this.paymentService.LoadLogForPaymentPromise(this.PaymentEditDetails)
  //      .subscribe(result => {

  //        if (result && result.status) {

  //          this.PaymentEditDetails.totalhours =
  //            result.data.reduce(
  //              (sum, item) => sum + Number(item.loghours),
  //              0
  //            );

  //          this.toastr.success(
  //            result.message || 'Hours fetched successfully'
  //          );
  //        }

  //      });

  //  }

  //}



  calculateAmount() {
    const selectedRate = this.ratelist.find(
      x => x.websettingsid == this.PaymentEditDetails.rateid
    );
    if (selectedRate) {
      const hours = Number(this.PaymentEditDetails.totalhours) || 0;
      const rate = Number(selectedRate.value) || 0;

      this.PaymentEditDetails.totalamount = hours * rate;
    }


  }



  //calculateAmount() {

  //  const selectedRate = this.ratelist.find(
  //    x => x.websettingsid ==
  //      this.PaymentEditDetails.Paymentrateid
  //  );

  //  if (selectedRate) {

  //    const hours =
  //      Number(this.PaymentEditDetails.totalhours) || 0;

  //    const rate =
  //      Number(selectedRate.value) || 0;

  //    this.PaymentEditDetails.totalamount =
  //      hours * rate;

  //  }

  //}

  updatePayment(form: NgForm) {
    if (form.valid) {
      this.PaymentEditDetails.feedetails =
        this.feesetupList.filter(x => x.ischecked === true);

      if (this.PaymentEditDetails.totalamount <= 0) {
        this.toastr.error('Please select at least one installment');
        return;
      }

      this.paymentService
        .paymentUpdatePromise(this.PaymentEditDetails)
        .subscribe(result => {

          if (result && result.status) {

            this.toastr.success(
              result.message || 'Payment updated successfully'
            );

            this._router.navigate(['app/payment']);

          } else {

            this.toastr.error(
              result.message || 'Error updating payment'
            );

          }

        });

    } else {

      this.toastr.error(
        'Please fill all mandatory fields'
      );

    }

  }

  cancelEdit() {
    this._router.navigate(['app/payment']);
  }

}
