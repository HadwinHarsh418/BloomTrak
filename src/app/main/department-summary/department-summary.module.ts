import { DepartmentSummaryComponent } from './department-summary.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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

const routes = [
  {
      path: '',
      component:     DepartmentSummaryComponent,
      canActivate: [AuthGuard],
  },

];

@NgModule({
  declarations: [DepartmentSummaryComponent],
  imports: [
    CommonModule,
    NgxDatatableModule,
    HttpClientModule,
    RouterModule.forChild(routes),
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
  ]
})
export class DepartmentSummaryModule { }
