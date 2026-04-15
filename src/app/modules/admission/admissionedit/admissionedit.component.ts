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
  Admissioninfoid: any;

  // Object to hold the form data
  admissionEditDetails: any = {};

  // Arrays to hold dropdown options (Required by HTML)
  programList: any[] = [];
  AdmissionType: any[] = [];
  stateList: any[] = [];
  batchList: any[] = [];

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
    this.loadDropdownData();
  }

  ngAfterViewInit() {
    // Grab the ID from the URL parameters and load the student's data
    this.route.queryParams.subscribe(params => {
      if (params.admissioninfoid) {
        this.Admissioninfoid = params.admissioninfoid;
        this.loadAdmissionDetails();
      }
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
    const loadProm = this.admissionService.admissionLoadDetailsPromise(this.Admissioninfoid);
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

  // --- FORM ACTIONS ---

  updateAdmission(form: NgForm) {
    if (form.valid) {
      const addProm = this.admissionService.admissionUpdatePromise(this.admissionEditDetails);
      addProm.subscribe(result => {
        if (result && result.status && result.data) {
          this.toastr.success(result.message || 'Admission updated successfully!');
          this._router.navigate(['app/admission']); // Redirect back to list after success
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
