import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { AuthGuard } from 'app/auth/helpers';
import { Role } from 'app/auth/models';

import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DataService } from 'app/auth/service/data.service';
import { DriversComponent } from './drivers.component';

const routes = [
  {
    path: '',
    component: DriversComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [DriversComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
    NgxDatatableModule
  ],
  providers: [DataService],
  exports: [DriversComponent]
})
export class DrivesModule { }
