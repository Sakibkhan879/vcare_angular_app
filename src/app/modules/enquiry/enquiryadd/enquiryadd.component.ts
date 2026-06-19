import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EnquiryService } from '../../../services/enquiry.service';
import { UtilityService } from '../../../services/utility.service';

@Component({
  selector: 'app-enquiryadd',
  templateUrl: './enquiryadd.component.html'
})
export class EnquiryaddComponent implements OnInit {

  programList: any[] = [];
  sourceList: any[] = [];
  genderList: any[] = [];

  // FIXED: Initialize with the property existing as 'false' (No)
  enquiryAddDetails: any = {
    hassibling: []
  };

  constructor(
    private _router: Router,
    private cdr: ChangeDetectorRef,
    private utilityService: UtilityService,
    private enquiryService: EnquiryService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadWebSetting();
  }

  // FIXED: Only ONE version of this function exists now
  enquiryAddData(form: NgForm) {
    // EASY DEBUG: Press F12 in browser -> Console tab
    console.log("Data being sent to API:", this.enquiryAddDetails);

    if (form.valid) {
      this.enquiryService.enquiryAddPromise(this.enquiryAddDetails).subscribe(result => {
        if (result && result.status) {
          this.toastr.success("Enquiry created successfully", "Success");
          this.clear(); 
          form.resetForm(); 
        } else {
          this.toastr.error(result.message || "Save failed");
        }
      });
    } else {
      this.toastr.error("Please enter all mandatory fields with proper information!");
    }
  }

  loadWebSetting() {
    this.utilityService.getWebSettingByDomainPromise('REFERAL').subscribe(result => {
      this.sourceList = result.data;
    });

    this.utilityService.getWebSettingByDomainPromise('PROGRAM').subscribe(result => {
      this.programList = result.data;
    });

    this.utilityService.getWebSettingByDomainPromise('GENDER').subscribe(result => {
      this.genderList = result.data;
    });
  }

  getTodayDate(): string {
    const today = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = String(today.getDate()).padStart(2, '0');
    const month = monthNames[today.getMonth()];
    const year = today.getFullYear();
    return `${day}-${month}-${year}`; 
  }

  clear() {
    // Resetting ensures the radio button has a value for the next entry
    this.enquiryAddDetails = {
      hassibling: false
    };
  }

  cancel() {
    this._router.navigate(['app/enquiry']);
  }
}
