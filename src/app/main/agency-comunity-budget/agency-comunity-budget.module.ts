import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgencyComunityBudgetRoutingModule } from './agency-comunity-budget-routing.module';
import { ComunityBudgetComponent } from './comunity-budget/comunity-budget.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { PhoneMaskDirectiveModule } from 'app/auth/helpers/phone-mask.directive';
import { CustomDateTimePipeModule } from 'app/auth/helpers/custom-date-time.pipe';
import { SharedpipeModule } from 'app/auth/helpers/sharedpipe/sharedpipe.module';
import { AddBudgetComponent } from './add-budget/add-budget.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ComunityBudgetComponent, AddBudgetComponent],
  imports: [
    CommonModule,
    AgencyComunityBudgetRoutingModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgxDatatableModule,
    ContentHeaderModule,
    PhoneMaskDirectiveModule,
    SharedpipeModule,
    CustomDateTimePipeModule,
    ReactiveFormsModule,
    FormsModule 
  ]
})
export class AgencyComunityBudgetModule { }
