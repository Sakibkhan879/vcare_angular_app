import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdmissionService } from '../../../services/admission.service';
import { UtilityService } from '../../../services/utility.service';

@Component({
  selector: 'app-admissionEdit',
  templateUrl: './admissionedit.component.html'
})
export class AdmissioneditComponent implements OnInit, AfterViewInit {
  studentmasterid: any;

  // Object to hold the form data
  admissionEditDetails: any = {};

  // Arrays to hold dropdown options (Required by HTML)
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
    private route: ActivatedRoute,
    private admissionService: AdmissionService,
    private toastr: ToastrService,
    public cdr: ChangeDetectorRef,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    // Load dropdown data when the component initializes

    this.loadWebSetting();  
  }

  ngAfterViewInit() {
    // Grab the ID from the URL parameters and load the student's data

    this.route.queryParams.subscribe(params => {
      if (params.studentmasterid) {
        this.studentmasterid = params.studentmasterid;
        this.loadAdmissionDetails();
      }
    });
  }



  loadWebSetting() {
    this.occupationList = [];
    var sourceProm = this.utilityService.getWebSettingByDomainPromise('OCCUPATION');
    sourceProm.subscribe(result => {
      this.occupationList = result.data;
    });

    this.typeList = [];
    var typeProm = this.utilityService.getWebSettingByDomainPromise('ADMISSION_TYPE');
    typeProm.subscribe(result => {
      this.typeList = result.data;
    });

    this.batchList = [];
    var typeProm = this.utilityService.getWebSettingByDomainPromise('BATCH_TYPE');
    typeProm.subscribe(result => {
      this.batchList = result.data;
    });

    this.standardList = [];

    var programProm = this.utilityService.getWebSettingByDomainPromise('STANDARD');
    programProm.subscribe(result => {
      this.standardList = result.data;
    });

    var programProm = this.utilityService.getWebSettingByDomainPromise('DIVISION');
    programProm.subscribe(result => {
      this.divisionList = result.data;
    });

    this.genderList = [];

    var genderProm = this.utilityService.getWebSettingByDomainPromise('GENDER');
    genderProm.subscribe(result => {
      this.genderList = result.data;
    });

    this.stateList = [];

    var stateProm = this.utilityService.getWebSettingByDomainPromise('STATE');
    stateProm.subscribe(result => {
      this.stateList = result.data;
    });

  }


  // --- API CALLS TO LOAD DATA ---

  loadDropdownData() {
    // Example: Replace these with your actual API calls to populate the dropdowns

    // State List
    this.utilityService.getWebSettingByDomainPromise('STATE').subscribe(result => {
      this.stateList = result.data || [];
    });

    // Program List (Add your specific API call here)
    // this.utilityService.getWebSettingByDomainPromise('PROGRAM').subscribe(result => {
    //   this.programList = result.data || [];
    // });

    // Admission Type List (Add your specific API call here)
    // this.utilityService.getWebSettingByDomainPromise('ADMISSION_TYPE').subscribe(result => {
    //   this.AdmissionType = result.data || [];
    // });

    // Batch List (Add your specific API call here)
    // this.utilityService.getWebSettingByDomainPromise('BATCH').subscribe(result => {
    //   this.batchList = result.data || [];
    // });
  }

  loadAdmissionDetails() {
    const loadProm = this.admissionService.admissionLoadDetailsPromise(this.studentmasterid);
    loadProm.subscribe(result => {
      if (result && result.status && result.data && result.data.length > 0) {
        this.admissionEditDetails = result.data[0];
        console.log('Loaded Data:', this.admissionEditDetails);
        this.cdr.markForCheck(); // Manually trigger change detection
      } else {
        this.toastr.error('Failed to load admission details.');
      }
    });
  }



  clear() {
    // Reset but keep the default locked values
    this.admissionEditDetails = {
      academicyearid: '',
      enquirydate: '',
      gender: '',
      hassibling: ''
    };
  }

  // --- FORM ACTIONS ---



  updateAdmission(form: NgForm) {
    if (form.valid) {
      const addProm = this.admissionService.admissionUpdatePromise(this.admissionEditDetails);
      addProm.subscribe(result => {
        if (result && result.status && result.data) {
          this.toastr.success(result.message || 'Admission updated successfully!');
          this._router.navigate(['app/admission']);
        } else {
          this.toastr.error(result.message || 'Error updating admission.');
        }
      });
    } else {
      this.toastr.error("Please enter all mandatory fields with proper information!");
    }
  }

  cancelEdit() {
    this._router.navigate(['app/admission']);
  }
}
