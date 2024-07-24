import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { AgencyPersonelComponent } from './agency-personel.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes = [
  {
    path: '',
    component: AgencyPersonelComponent,
  }
];

@NgModule({
  declarations: [AgencyPersonelComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    // IntlInputPhoneModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
    SharedpipeModule,
    PhoneMaskDirectiveModule,
    NgxDatatableModule,
    ContentHeaderModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class AgencyPersonelModule { }
