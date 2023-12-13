import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminNotificationsComponent } from './admin-notifications.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { CustomDateTimePipeModule } from 'app/auth/helpers/custom-date-time.pipe';
import { PhoneMaskDirectiveModule } from 'app/auth/helpers/phone-mask.directive';
import { SharedpipeModule } from 'app/auth/helpers/sharedpipe/sharedpipe.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AuthGuard } from 'app/auth/helpers';
import { RouterModule } from '@angular/router';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AddNotificationsComponent } from './add-notifications/add-notifications.component';

const routes = [
  {
    path: '',
    component: AdminNotificationsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-notifications/:id',
    component: AddNotificationsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-notifications',
    component: AddNotificationsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [AdminNotificationsComponent, AddNotificationsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxDatatableModule,
    HttpClientModule,
    TranslateModule,
    FormsModule,
    ContentHeaderModule,
    NgbModule,
    ReactiveFormsModule, 
    PerfectScrollbarModule,
    CoreCommonModule,    
    PhoneMaskDirectiveModule,
    SharedpipeModule,
    CustomDateTimePipeModule,
    NgMultiSelectDropDownModule
   ]
})
export class AdminNotificationsModule { }
