import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { ContractComponent } from './contract/contract.component';


const routes = [
  {
    path: '',
    component: ContractComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [ContractComponent],
  imports: [
    CommonModule,    
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
    NgxDatatableModule
  ]
})
export class ContractsModule { }
