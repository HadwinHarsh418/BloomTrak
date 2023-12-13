import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/auth/helpers';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProjectComponent } from './project.component';
const routes = [
  {
    path: '',
    component: ProjectComponent,
    canActivate: [AuthGuard],
  },
];


@NgModule({
  declarations: [ProjectComponent],
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
export class ProjectModule { }
