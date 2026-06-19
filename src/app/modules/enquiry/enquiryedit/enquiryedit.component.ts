import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EnquiryService } from '../../../services/enquiry.service';
import { UtilityService } from '../../../services/utility.service';

@Component({
  selector: 'app-enquiryEdit',
  templateUrl: './enquiryedit.component.html'
})
export class EnquiryeditComponent implements OnInit, AfterViewInit {
  enquirymasterid: any;
  sourceList: any[] = [];

  // Object to hold the form data
  enquiryEditDetails: any = {};

  // Arrays to hold dropdown options (Required by HTML)
  programList: any[] = [];
  AdmissionType: any[] = [];
  stateList: any[] = [];
  batchList: any[] = [];
  genderList: any[] = [];

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private enquiryService: EnquiryService,
    private toastr: ToastrService,
    public cdr: ChangeDetectorRef,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.loadDropdownData();
    this.loadProgramWebSetting();
    this.loadSourceWebSetting();
    this.loadGenderWebSetting();
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      if (params.enquirymasterid) {
        this.enquirymasterid = params.enquirymasterid;
        this.loadEnquiryDetails();
      }
    });
  }


  loadProgramWebSetting() {
    this.programList = [];

    this.utilityService.getWebSettingByDomainPromise('PROGRAM')
      .subscribe(result => {
        this.programList = result.data || [];
        console.log('Program List', this.programList);
      });
  }

  loadGenderWebSetting() {
    this.genderList = [];
    this.utilityService.getWebSettingByDomainPromise('GENDER')     .subscribe(result => {
        this.genderList = result.data || [];
        console.log('Gender List', this.genderList);
      });
  }
 
  loadSourceWebSetting() {
    this.sourceList = [];
    var sourceProm = this.utilityService.getWebSettingByDomainPromise('REFERAL');
    sourceProm.subscribe(result => {
      this.sourceList = result.data;
    });
  }


  loadDropdownData() {
    this.utilityService.getWebSettingByDomainPromise('STATE').subscribe(result => {
      this.stateList = result.data || [];
    });

  }


  loadEnquiryDetails() {
    const loadProm = this.enquiryService.enquiryLoadDetailsPromise(this.enquirymasterid);
    loadProm.subscribe(result => {
      if (result && result.status && result.data && result.data.length > 0) {
        this.enquiryEditDetails = result.data[0];
        console.log('Loaded Data:', this.enquiryEditDetails);
        this.cdr.markForCheck();
      } else {
        this.toastr.error('Failed to load enquiry details.');
      }
    });
  }


  enquiryEditData(form: NgForm) {
    if (form.valid) {
      // USE THE ACTUAL API CALL
      var addProm = this.enquiryService.enquiryUpdatePromise(this.enquiryEditDetails);
      addProm.subscribe(result => {
        if (result && result.status && result.data) {
          this.toastr.success(result.message);

          // Convert string values to number
          this.enquiryEditDetails.genderid =
            Number(this.enquiryEditDetails.genderid);

          this.enquiryEditDetails.programid =
            Number(this.enquiryEditDetails.programid);

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

  // --- FORM ACTIONS ---

  updateEnquiry(form: NgForm) {
    if (form.valid) {
      const addProm = this.enquiryService.enquiryUpdatePromise(this.enquiryEditDetails);
      addProm.subscribe(result => {
        if (result && result.status && result.data) {
          this.toastr.success(result.message || 'Enquiry updated successfully!');
          this._router.navigate(['app/enquiry']);
        } else {
          this.toastr.error(result.message || 'Error updating enquiry.');
        }
      });
    } else {
      this.toastr.error("Please enter all mandatory fields with proper information!");
    }
  }

  cancelEdit() {
    this._router.navigate(['app/enquiry']);
  }
}
