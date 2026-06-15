import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdmissionService } from '../../../services/admission.service';
import { UtilityService } from '../../../services/utility.service';

@Component({
  selector: 'app-admissionadd',
  templateUrl: './admissionadd.component.html'
})
export class AdmissionaddComponent implements OnInit {

  // FIXED: One single declaration with all booleans initialized to false
  admissionAddDetails: any = {    
    
  };

  occupationList: any[] = [];
  standardList: any[] = [];
  sourceList: any[] = [];
  stateList: any[] = [];
  batchList: any[] = [];
  typeList = [];
  genderList = [];
  divisionList = [];

  constructor(
    private _router: Router,
    private cdr: ChangeDetectorRef,
    private utilityService: UtilityService,
    private admissionService: AdmissionService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadWebSetting();

  }


  loadWebSetting() {
    this.utilityService.getWebSettingByDomainPromise('OCCUPATION').subscribe(res => this.occupationList = res.data);
    this.utilityService.getWebSettingByDomainPromise('ADMISSION_TYPE').subscribe(res => this.typeList = res.data);
    this.utilityService.getWebSettingByDomainPromise('BATCH_TYPE').subscribe(res => this.batchList = res.data);
    this.utilityService.getWebSettingByDomainPromise('STANDARD').subscribe(res => this.standardList = res.data);
    this.utilityService.getWebSettingByDomainPromise('DIVISION').subscribe(res => this.divisionList = res.data);
    this.utilityService.getWebSettingByDomainPromise('GENDER').subscribe(res => this.genderList = res.data);
    this.utilityService.getWebSettingByDomainPromise('STATE').subscribe(res => this.stateList = res.data);
  }

  CreateAdmission(form: NgForm) {
    if (form.valid) {
      // DEBUG: Verify all 3 radio buttons in your console
      console.log("Final Payload:", this.admissionAddDetails);

      this.admissionService.admissionAddPromise(this.admissionAddDetails).subscribe(result => {
        if (result && result.status) {
          this.toastr.success("Admission created successfully", "Success" );
          this.clear();
          form.resetForm();
        } else {
          this.toastr.error(result.message);
        }
      });
    } else {
      this.toastr.error("Please enter all mandatory fields with proper information!");
    }
  }


  clear() {
    // FIXED: Ensuring all radio buttons reset to 'false' (No)
    this.admissionAddDetails = {
      istransport: '',
      isattended:'' ,
      hassibling: '',
      academicyearid: '',
      enquirydate: '',
      gender: ''
    };
  }


  getTodayDate(): string {
    const today = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = String(today.getDate()).padStart(2, '0');
    const month = monthNames[today.getMonth()];
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  }
}
