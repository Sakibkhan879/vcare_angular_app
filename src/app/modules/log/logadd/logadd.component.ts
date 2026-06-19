

import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';
import { LogService } from '../../../services/log.service'; // Updated Service

import { AdmissionService } from '../../../services/admission.service';
import { UtilityService } from '../../../services/utility.service';


@Component({
  selector: 'app-logadd',
  templateUrl: './logadd.component.html',
  styleUrls: ['./logadd.component.css']
})

export class LogaddComponent implements OnInit {
  LogAddDetails: any = {};
  admissionEditDetails: any = {};
  searchQuery: string = '';
  searchedStudents: any[] = [];
  selectedStudent: any = null;
   standardList: any[] = [];



  // Used for Checkbox logic
  feesetupList: any = [];

  constructor(
    private _router: Router,
    private admissionService: AdmissionService,
    private toastr: ToastrService,
    public cdr: ChangeDetectorRef,
    private paymentService: PaymentService,
    private logService: LogService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.loadWebSetting();
  }


  loadWebSetting() {     
    this.utilityService.getWebSettingByDomainPromise('STANDARD').subscribe(result => {
      this.standardList = result.data;
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
  
    this.LoadStudentForLog(student);
  }

  LoadStudentForLog(student: any) {
    this.logService.LoadStudentForLog(student).subscribe((result: any) => {
      if (result?.data) {
        const data = result.data.Table[0];

        this.selectedStudent = data;
        this.admissionEditDetails = { ...data };        


        this.LogAddDetails = {
          studentmasterid: data.studentmasterid,
          academicyearid: data.academicyearid,
         logdate: new Date(),
        };

        this.cdr.detectChanges();
      }
    });
  }






 
  CreateLog(form: NgForm) {
    if (form.valid) {
      // Add logic here to include installments in LogAddDetails if your API requires it

 
      this.logService.LogAddPromise(this.LogAddDetails).subscribe(result => {
        if (result && result.status) {
          this.toastr.success(result.message || 'log saved successfully');
          this._router.navigate(['app/log']);
        } else {
          this.toastr.error(result.message || 'Error saving log');
        }
      });
    } else {
      this.toastr.error("Please fill all mandatory fields");
    }
  }

  cancel() {
    this._router.navigate(['app/payment']);
  }
}
