import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReportsComponent } from '../reports.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import {NgxPrintModule} from 'ngx-print';
const routes = [
  {
    path: '',
    component: ReportsComponent,
  }
];


@NgModule({
  declarations: [ReportsComponent],
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
  ],
  providers: [DatePipe]
})
export class ReportsModule { }
