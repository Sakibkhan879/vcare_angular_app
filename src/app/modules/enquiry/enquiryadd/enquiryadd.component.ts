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
    this.loadProgramWebSetting();
    this.loadSourceWebSetting();
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
  loadProgramWebSetting() {
    this.programList = [];
    // var programProm = this.utilityService.getWebSettingByDomainPromise('PROGRAMS');
    // programProm.subscribe(result => { this.programList = result.data; });
    
    // Mock Data for UI testing
    this.programList = [{ id: 1, name: 'PlayGroup' }, { id: 2, name: 'Nursery' }];
  }

  loadSourceWebSetting() {
    this.sourceList = [];
    // var sourceProm = this.utilityService.getWebSettingByDomainPromise('LEAD_SOURCE');
    // sourceProm.subscribe(result => { this.sourceList = result.data; });

    // Mock Data for UI testing
    this.sourceList = [{ id: 1, name: 'Walk-in' }, { id: 2, name: 'Social Media' }];
  }

  clear() {
    // Reset but keep the default locked values
    this.enquiryAddDetails = {
      academicyear: 'Apr 25 - Mar 26',
      enquirydate: '09-Apr-2026', 
      gender: 'Boy',
      hassibling: 'No'
    };
  }

  cancel() {
    this._router.navigate(['app/enquiry']);
  }
}