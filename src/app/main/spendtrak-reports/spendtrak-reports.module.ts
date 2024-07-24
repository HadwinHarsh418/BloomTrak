import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgApexchartsModule } from 'ng-apexcharts';
import {NgxPrintModule} from 'ngx-print';
import { SpendtrakReportsComponent } from './spendtrak-reports.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

const routes = [
  {
    path: '',
    component: SpendtrakReportsComponent,
  }
];


@NgModule({
  declarations: [SpendtrakReportsComponent],
  imports: [
    CommonModule,  
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
    NgxDatatableModule,
    ContentHeaderModule,
    NgxPrintModule,
  ]
})
export class SpendtrakReportsModule { }
