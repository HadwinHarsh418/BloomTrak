import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShiftComponent } from './shift.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ShiftPostingComponent } from './shift-posting/shift-posting.component';
import { ShiftConfirmationComponent } from './shift-confirmation/shift-confirmation.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { SharedCalenderComponent } from '../shared-calender/shared-calender.component';
import { SharedCalenderModule } from '../shared-calender/shared-calender.module';
import { ViewCardComponent } from './view-card/view-card.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CustomDateTimePipeModule } from 'app/auth/helpers/custom-date-time.pipe';
import { EditShiftComponent } from './edit-shift/edit-shift.component';
import { SharedpipeModule } from 'app/auth/helpers/sharedpipe/sharedpipe.module';
import { PhoneMaskDirectiveModule } from 'app/auth/helpers/phone-mask.directive';
import { AssignListForAgencyUserComponent } from './assign-list-for-agency-user/assign-list-for-agency-user.component';
import { AppliedListComponent } from './applied-list/applied-list.component';
import { ToastrModule } from 'ng6-toastr-notifications';
import { MyAccountService } from './shift-confirmation/my-account.service';
import { NewShiftsComponent } from './new-shifts/new-shifts.component';
import { RequestShiftComponent } from 'app/request-shift/request-shift.component';
import { RequestedShiftsComponent } from 'app/requested-shifts/requested-shifts.component';
import { CustomDirectives } from 'app/auth/helpers/percentage-directive.directive';
import { NgDateModule } from 'app/layout/components/ng-date/ng-date.module';

const routes = [
  // {
  //   path: '',
  //   component: ShiftComponent,
  //   canActivate: [AuthGuard],
  // },
  {
    path: '',
    component: NewShiftsComponent,
  },
  {
    path: 'request-shift',
    component: RequestShiftComponent,
  },
  {
    path: 'requested-shifts',
    component: RequestedShiftsComponent,
  },
  {
    path: 'shift-posting',
    component: ShiftPostingComponent,
  },
  {
    path: 'shift-confirmation',
    component: ShiftConfirmationComponent,
  },
  {
    path: 'shared-calender',
    component: SharedCalenderComponent,
  },{
    path: 'view-card',
    component: ViewCardComponent,
  },
  {
    path: 'edit-shift',
    component: EditShiftComponent,
  },
  {
    path: 'assign-list',
    component: AssignListForAgencyUserComponent,
  },
  {
    path: 'applied-list',
    component: AppliedListComponent,
  },
];

@NgModule({
  declarations: [
    ShiftComponent,
     ShiftPostingComponent,
      ShiftConfirmationComponent, 
      ViewCardComponent,
        EditShiftComponent,
        AssignListForAgencyUserComponent,
        AppliedListComponent,
        NewShiftsComponent,
        RequestShiftComponent,
        RequestedShiftsComponent,
        
    ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
    NgxDatatableModule,
    NgMultiSelectDropDownModule.forRoot(),
    ContentHeaderModule, 
    SharedpipeModule,
    PhoneMaskDirectiveModule,
    SharedCalenderModule,
    CustomDateTimePipeModule,
    ToastrModule.forRoot(),
    CustomDirectives,
    NgDateModule
  ],
  providers:[MyAccountService]
})
export class ShiftModule { }
