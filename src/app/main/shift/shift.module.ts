import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShiftComponent } from './shift.component';
import { AuthGuard } from 'app/auth/helpers';
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

const routes = [
  // {
  //   path: '',
  //   component: ShiftComponent,
  //   canActivate: [AuthGuard],
  // },
  {
    path: '',
    component: NewShiftsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'shift-posting',
    component: ShiftPostingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'shift-confirmation',
    component: ShiftConfirmationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'shared-calender',
    component: SharedCalenderComponent,
    canActivate: [AuthGuard],
  },{
    path: 'view-card',
    component: ViewCardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-shift',
    component: EditShiftComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'assign-list',
    component: AssignListForAgencyUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'applied-list',
    component: AppliedListComponent,
    canActivate: [AuthGuard],
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
        NewShiftsComponent
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
    ToastrModule.forRoot()
  ],
  providers:[MyAccountService]
})
export class ShiftModule { }
