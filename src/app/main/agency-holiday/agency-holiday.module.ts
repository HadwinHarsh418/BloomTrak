import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgencyHolidayComponent } from './agency-holiday.component';
import { AuthGuard } from 'app/auth/helpers';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PhoneMaskDirectiveModule } from 'app/auth/helpers/phone-mask.directive';
import { SharedpipeModule } from 'app/auth/helpers/sharedpipe/sharedpipe.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { AddagencyHolidayComponent } from './addagency-holiday/addagency-holiday.component';
import { EditAgencyholidayComponent } from './edit-agencyholiday/edit-agencyholiday.component';
import { CustomDateTimePipeModule } from 'app/auth/helpers/custom-date-time.pipe';

const routes = [
  {
    path: '',
    component: AgencyHolidayComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-holiday',
    component: AddagencyHolidayComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-holiday/:id',
    component: EditAgencyholidayComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  declarations: [AgencyHolidayComponent, AddagencyHolidayComponent, EditAgencyholidayComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
    PhoneMaskDirectiveModule,
    SharedpipeModule,
    NgxDatatableModule,
    ContentHeaderModule,
    CustomDateTimePipeModule
  ]
})
export class AgencyHolidayModule { }
