import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// import { IntlInputPhoneModule } from 'intl-input-phone';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AuthGuard } from 'app/auth/helpers';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PhoneMaskDirectiveModule } from 'app/auth/helpers/phone-mask.directive';
import { SharedpipeModule } from 'app/auth/helpers/sharedpipe/sharedpipe.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { CustomDirectives } from 'app/auth/helpers/percentage-directive.directive';
import { EmployeeListComponent } from 'app/employee-list/employee-list.component';

const routes = [
  {
    path: '',
    component: UserComponent,
  },{
    path: 'add-user',
    component: AddUserComponent,
  },{
    path: 'edit-user',
    component: EditUserComponent,
    canActivate: [AuthGuard],
  },{
    path: 'employee-list',
    component: EmployeeListComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
    
    declarations: [UserComponent, AddUserComponent, EditUserComponent,EmployeeListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    // IntlInputPhoneModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
    SharedpipeModule,
    PhoneMaskDirectiveModule,
    NgxDatatableModule,
    ContentHeaderModule,
    NgMultiSelectDropDownModule.forRoot(),
    CustomDirectives
  ] 
 
})
export class UserModule { }
