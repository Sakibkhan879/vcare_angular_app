import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdmissionService } from '../../../services/admission.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { UtilityService } from '../../../services/utility.service';
// import { EnquiryService } from '../../../services/enquiry.service'; // Uncomment and create this

@Component({
  selector: 'app-admissionadd',
  templateUrl: './admissionadd.component.html'

})
export class AdmissionaddComponent implements OnInit {
  admissionAddDetails: any = {};
  //enquiryAddDetails: any = {};
  AdmissionType: any[] = [];
  programList: any[] = [];
  sourceList: any[] = [];
  stateList: any[] = [];
  batchList: any[] = [];

  constructor(
    private _router: Router,
    private cdr: ChangeDetectorRef,
    private utilityService: UtilityService,
    private admissionService: AdmissionService,
    private toastr: ToastrService
  ) { }


  ngOnInit() {
    this.loadProgramWebSetting();
    this.loadSourceWebSetting();
    this.loadStates();
  }
  loadStates() {
    this.stateList = [
      { id: 1, name: 'Maharashtra' },
      { id: 2, name: 'Karnataka' },
      { id: 3, name: 'Gujarat' }
    ];
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
      var addProm = this.admissionService.admissionAddPromise(this.admissionAddDetails);
      addProm.subscribe(result => {
        if (result && result.status && result.data) {
          this.toastr.success(result.message);

          // Reset form but keep default locked values
          form.reset({});
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
    this.admissionAddDetails = {
      academicyearid: '',
      enquirydate: '',
      gender: '',
      hassibling: ''
    };
  }

  cancel() {
    this._router.navigate(['app/admission']);
  }
}
