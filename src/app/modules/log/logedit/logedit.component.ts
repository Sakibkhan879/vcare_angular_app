import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilityService } from '../../../services/utility.service';
import { LogService } from '../../../services/log.service';

@Component({
  selector: 'app-logedit',
  templateUrl: './logedit.component.html'
})


export class LogeditComponent implements OnInit {

  logmasterid: number | null = null;

  LogEditDetails: any = {};
  admissionEditDetails: any = { standardid: null };

  standardList: any[] = [];

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private utilityService: UtilityService,
    private logService: LogService
  ) { }

  ngOnInit(): void {

    this.loadWebSetting();

    this.route.queryParams.subscribe(params => {

      if (params?.logmasterid) {

        this.logmasterid = Number(params.logmasterid);

        this.loadLogDetails();
      }
    });
  }

  loadWebSetting(): void {

    this.utilityService
      .getWebSettingByDomainPromise('STANDARD')
      .subscribe({
        next: (result: any) => {
          this.standardList = result?.data || [];
        },
        error: () => {
          this.toastr.error('Failed to load standards');
        }
      });
  }

  loadLogDetails(): void {

    if (!this.logmasterid) return;
    const obj = {
      logmasterid: this.logmasterid
    };
    this.logService
      .LoadLogDetailsByIdPromise(obj)
      .subscribe({
        next: (result: any) => {
 
          if (result?.status && result?.data?.length > 0) {

            this.LogEditDetails = result.data[0];

            

          } else {
            this.toastr.error("No data found for this log");
          }
        },
        error: (err) => {
          console.error("LOAD ERROR:", err);
          this.toastr.error("Failed to load log details");
        }
      });
  }

  UpdateLog(form: NgForm): void {

    if (!form.valid) {
      this.toastr.error('Please fill all mandatory fields');
      return;
    }

    this.logService
      .UpdateLogDetailsByIdPromise(this.LogEditDetails)
      .subscribe({
        next: (result: any) => {

          if (result?.status) {
            this.toastr.success('Log updated successfully');
            this._router.navigate(['app/log']);
          } else {
            this.toastr.error(result?.message || 'Update failed');
          }

        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Error updating log');
        }
      });
  }

  cancelEdit(): void {
    this._router.navigate(['app/log']);
  }
}
