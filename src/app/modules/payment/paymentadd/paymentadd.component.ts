import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';
import { AdmissionService } from '../../../services/admission.service';
import { UtilityService } from '../../../services/utility.service';

@Component({
  selector: 'app-paymentadd',
  templateUrl: './paymentadd.component.html'
})

export class PaymentaddComponent implements OnInit {
  PaymentAddDetails: any = {};
  admissionEditDetails: any = {};
  searchQuery: string = '';
  searchedStudents: any[] = [];
  selectedStudent: any = null;
  paymentmodeList: any[] = [];
  standardList: any[] = [];
  ratelist: any[] = [];
  fromdate: any[] = [];
  todate: any[] = [];
 


  // Used for Checkbox logic
  feesetupList: any = [];
  companycode: string = "";


  constructor(
    private _router: Router,
    private admissionService: AdmissionService,
    private toastr: ToastrService,
    public cdr: ChangeDetectorRef,
    private paymentService: PaymentService,
    private utilityService: UtilityService
  ) {
    if (localStorage["companycode"]) {
      this.companycode = localStorage["companycode"];
    }
  }

  ngOnInit() {
    this.loadWebSetting();
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


  searchStudent() {
    if (!this.searchQuery.trim()) {
      this.toastr.warning("Enter name or mobile number");
      return;
    }

    this.admissionService.admissionListPromise().subscribe((result: any) => {
      if (result?.status && result?.data) {
        const query = this.searchQuery.toLowerCase();
        this.searchedStudents = result.data.filter((x: any) =>
          (x.studentname && x.studentname.toLowerCase().includes(query)) ||
          (x.fatherphoneno && x.fatherphoneno.includes(query))
        );

        if (this.searchedStudents.length === 0) {
          this.toastr.error("No student found");
        }
      }
    });
  }



  selectStudent(student: any) {
    // Use a descriptive name for the logic of fetching details
    
    this.LoadStudentForPayment(student);
  }

  LoadStudentForPayment(student:any) {
    this.paymentService.FeeSetupLoadPromise(student).subscribe((result: any) => {
      if (result?.data) {
         const data = result.data.Table[0];

         this.selectedStudent = data;
        this.admissionEditDetails = { ...data };

        this.feesetupList = result.data.Table1;


        this.PaymentAddDetails = {
          studentmasterid: data.studentmasterid,
          academicyearid: data.academicyearid,
          companymasterid: data.companymasterid,
          paymentdate: new Date(),
          totalamount: 0
            


        };

        this.cdr.detectChanges();
      }
    });
  }
   

  calculateTotal() {
 
    // Calculate the sum
    const sum = this.feesetupList
      .filter(fee => fee.ischecked)
      .reduce((acc, current) => {
        return acc + Number(current.amount);
      }, 0);


     this.PaymentAddDetails.totalamount = sum; 
  }

  //feedetails() {
  //  this.PaymentAddDetails.feesetupList = [];
  //}

   


  totalPayableAmount: number = 0;




  fetchhours() {

    ////if (!this.PaymentAddDetails.fromdate) {
    ////  this.toastr.error('Please select From Date');
    ////  return;
    ////}

    ////if (!this.PaymentAddDetails.todate) {
    ////  this.toastr.error('Please select To Date');
    ////  return;
    ////}

    this.paymentService.LoadLogForPaymentPromise(this.PaymentAddDetails)
      .subscribe(result => {
        if (result && result.status) {
          this.PaymentAddDetails.totalhours =
            result.data.reduce(
              (sum, item) => sum + Number(item.loghours),
              0
            );
          this.toastr.success('Hours fetched successfully');
          this.calculateAmount(); // recalculate amount automatically
        }

      });
  }


  //fetchhours(form: NgForm) {
  //  if (form.valid) {
  //    // Add logic here to include installments in PaymentAddDetails if your API requires it

  //    /*this.PaymentAddDetails.feedetails = this.feesetupList;*/

  //    console.log(this.PaymentAddDetails.loghours)

  //    this.paymentService.LoadLogForPaymentPromise(this.PaymentAddDetails).subscribe(result => {
  //      if (result && result.status) {
  //        this.PaymentAddDetails.totalhours = result.data.reduce(
  //          (sum, item) => sum + Number(item.loghours),
  //          0
  //        );

  //        this.toastr.success(result.message || 'Hours fetched successfully');
  //      } 
  //    });
  //  }  
  //}


  calculateAmount() {

    const selectedRate = this.ratelist.find(
      x => x.websettingsid == this.PaymentAddDetails.rateid
    );

    if (selectedRate) {
      const hours = Number(this.PaymentAddDetails.totalhours) || 0;
      const rate = Number(selectedRate.value) || 0;

      this.PaymentAddDetails.totalamount = hours * rate;
    }


  }



  CreatePayment(form: NgForm) {

    if (form.valid) {

      this.PaymentAddDetails.feedetails = this.feesetupList;

      // Company 2 doesn't use dates
     
      if (this.PaymentAddDetails.totalamount <= 0) {
        this.toastr.error('Please select at least one installment');
        return;
      }

      this.paymentService.paymentsmadeAddPromise(this.PaymentAddDetails)
        .subscribe(result => {

          if (result && result.status) {
            this.toastr.success(result.message || 'Payment saved successfully');
            this._router.navigate(['app/payment']);
          } else {
            this.toastr.error(result.message || 'Error saving payment');
          }

        });

    } else {
      this.toastr.error("Please fill all mandatory fields");
    }
  }

  //CreatePayment(form: NgForm) {
  //  if (form.valid) {
  //    // Add logic here to include installments in PaymentAddDetails if your API requires it

  //    this.PaymentAddDetails.feedetails = this.feesetupList;
        
  //    this.paymentService.paymentsmadeAddPromise(this.PaymentAddDetails).subscribe(result => {
  //      if (result && result.status) {
  //        this.toastr.success(result.message || 'Payment saved successfully');
  //        this._router.navigate(['app/payment']);
  //      } else {
  //        this.toastr.error(result.message || 'Error saving payment');
  //      }
  //    });
  //  } else {
  //    this.toastr.error("Please fill all mandatory fields");
  //  }
  //}

  cancel() {
    this._router.navigate(['app/payment']);
  }
}
