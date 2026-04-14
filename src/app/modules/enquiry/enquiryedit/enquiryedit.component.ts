import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EnquiryService } from '../../../services/enquiry.service';
// import { EnquiryService } from '../../../services/enquiry.service';

@Component({
  selector: 'app-enquiryedit',
  templateUrl: './enquiryedit.component.html'
})
export class EnquiryeditComponent implements AfterViewInit {
  Enquiryinfoid: any;
  programList: any[] = [];
  sourceList: any[] = [];
  
  enquiryEditDetails: any = {};

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private enquiryService: EnquiryService,
    private toastr: ToastrService,
    public cdr: ChangeDetectorRef
  ) {
    this.loadProgramWebSetting();
    this.loadSourceWebSetting();
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      this.Enquiryinfoid = params.enquiryinfoid;
      if(this.Enquiryinfoid) {
        this.enquiryLoadDetails();
      }
    });
  }

  enquiryLoadDetails() {
    // USE ACTUAL LOAD API
    var loadProm = this.enquiryService.enquiryLoadDetailsPromise(this.Enquiryinfoid);
    loadProm.subscribe(result => {
      if (result && result.status && result.data && result.data.length > 0) {
        this.enquiryEditDetails = result.data[0];
        this.cdr.markForCheck();
      }
    });
  }

  enquiryEditData(form: NgForm) {
    if (form.valid) {
      // USE ACTUAL UPDATE API
      var updateProm = this.enquiryService.enquiryUpdatePromise(this.enquiryEditDetails);
      updateProm.subscribe(result => {
        if (result && result.status && result.data) {
          this.toastr.success(result.message);
          this._router.navigate(['app/enquiry']); // Redirect back to list on success
        } else {
          this.toastr.error(result.message);
        }
      });
    } else {
      this.toastr.error("Please enter all mandatory fields with proper information!");
    }
  }

  loadProgramWebSetting() {
    this.programList = [{ id: 1, name: 'PlayGroup' }, { id: 2, name: 'Nursery' }]; // Mock
  }

  loadSourceWebSetting() {
    this.sourceList = [{ id: 1, name: 'Walk-in' }, { id: 2, name: 'Social Media' }]; // Mock
  }

  cancel() {
    this._router.navigate(['app/enquiry']);
  }
}