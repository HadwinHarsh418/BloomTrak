import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementUserComponent } from './management-user.component';
import { AuthGuard } from 'app/auth/helpers';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { PhoneMaskDirectiveModule } from 'app/auth/helpers/phone-mask.directive';
import { SharedpipeModule } from 'app/auth/helpers/sharedpipe/sharedpipe.module';
import { CustomDateTimePipeModule } from 'app/auth/helpers/custom-date-time.pipe';
import { EditManagementUserComponent } from './edit-management-user/edit-management-user.component';
import { AddManagementUserComponent } from './add-management-user/add-management-user.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

const routes = [
  {
      path: '',
      component: ManagementUserComponent,
  },
  {
    path:'add-managementUser',
    component: AddManagementUserComponent,
  },
  {
    path: 'add-managementUser/:id',
    component: AddManagementUserComponent,
  }
];

@NgModule({
  declarations: [ManagementUserComponent, EditManagementUserComponent, AddManagementUserComponent],
  imports: [
    CommonModule ,  
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgxDatatableModule,
    ContentHeaderModule,
    PhoneMaskDirectiveModule,
    SharedpipeModule,
    CustomDateTimePipeModule, 
    NgMultiSelectDropDownModule
  ]
})
export class ManagementUserModule { }
