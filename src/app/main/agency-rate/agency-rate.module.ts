import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgencyRateComponent } from './agency-rate.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PhoneMaskDirectiveModule } from 'app/auth/helpers/phone-mask.directive';
import { SharedpipeModule } from 'app/auth/helpers/sharedpipe/sharedpipe.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { AddAgencyRateComponent } from '../add-agency-rate/add-agency-rate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditAgencyRatesComponent } from './edit-agency-rates/edit-agency-rates.component';

const routes = [
  {
    path: '',
    component: AgencyRateComponent,
  },

  {
    path: 'add-agencyrate',
    component: AddAgencyRateComponent,
  },

  {
    path: 'edit-agencyrate/:id',
    component: EditAgencyRatesComponent,
  },
 
 
];

@NgModule({
  declarations: [AgencyRateComponent,AddAgencyRateComponent, EditAgencyRatesComponent],
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
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AgencyRateModule { }
