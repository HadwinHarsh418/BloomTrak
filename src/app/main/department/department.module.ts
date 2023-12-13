import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentRoutingModule } from './department-routing.module';
import { DepartmentComponent } from './department.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddDepartmentComponent } from './add-department/add-department.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditDepartmentComponent } from './edit-department/edit-department.component';
import { CoreCommonModule } from '@core/common.module';
import { CustomDateTimePipeModule } from 'app/auth/helpers/custom-date-time.pipe';
import { PhoneMaskDirectiveModule } from 'app/auth/helpers/phone-mask.directive';
import { SharedpipeModule } from 'app/auth/helpers/sharedpipe/sharedpipe.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [DepartmentComponent, AddDepartmentComponent, EditDepartmentComponent],
  imports: [
    CommonModule,
    DepartmentRoutingModule,
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
    NgMultiSelectDropDownModule,
  ]
})
export class DepartmentModule { }
