import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EnquiryService } from '../../../services/enquiry.service';

import { UtilityService } from '../../../services/utility.service';
// import { EnquiryService } from '../../../services/enquiry.service'; // Uncomment and create this

@Component({
  selector: 'app-enquiryadd',
  templateUrl: './enquiryadd.component.html'
})
export class EnquiryaddComponent implements OnInit {

  programList: any[] = [];
  sourceList: any[] = [];
  genderList: any[] = [];

  // Default values mapped to the UI in your screenshot
  enquiryAddDetails: any = { };

  constructor(
    private _router: Router,
    private cdr: ChangeDetectorRef,
    private utilityService: UtilityService,
    // private enquiryService: EnquiryService, 
    private enquiryService: EnquiryService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadWebSetting();
  }
  getTodayDate(): string {
    const today = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = String(today.getDate()).padStart(2, '0');
    const month = monthNames[today.getMonth()];
    const year = today.getFullYear();
    
    return `${day}-${month}-${year}`; 
  }

  enquiryAddData(form: NgForm) {
    if (form.valid) {
      // USE THE ACTUAL API CALL
      var addProm = this.enquiryService.enquiryAddPromise(this.enquiryAddDetails);
      addProm.subscribe(result => {
        if (result && result.status && result.data) {
          this.toastr.success(result.message);
          
          // Reset form but keep default locked values
          form.reset({ });
        } else {
          this.toastr.error(result.message);
        }
      });
    } else {
      this.toastr.error("Please enter all mandatory fields with proper information!");
    }
  }


  loadWebSetting() {
    this.sourceList = [];
    var sourceProm = this.utilityService.getWebSettingByDomainPromise('REFERAL');
    sourceProm.subscribe(result => {
      this.sourceList = result.data;
    });

    this.programList = [];

    var programProm = this.utilityService.getWebSettingByDomainPromise('PROGRAM');
    programProm.subscribe(result => {
      this.programList = result.data;
    });

    this.genderList = [];

    var genderProm = this.utilityService.getWebSettingByDomainPromise('GENDER');
    genderProm.subscribe(result => {
      this.genderList = result.data;
    });

  }

  clear() {
    // Reset but keep the default locked values
    this.enquiryAddDetails = {
    };
  }

  cancel() {
    this._router.navigate(['app/enquiry']);
  }
}
