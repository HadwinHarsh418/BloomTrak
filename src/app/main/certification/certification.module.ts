import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificationComponent } from './certification.component';
import { AddCertificationComponent } from './add-certification/add-certification.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { PhoneMaskDirectiveModule } from 'app/auth/helpers/phone-mask.directive';
import { SharedpipeModule } from 'app/auth/helpers/sharedpipe/sharedpipe.module';
import { CustomDateTimePipeModule } from 'app/auth/helpers/custom-date-time.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


const routes = [
  {
      path: '',
      component: CertificationComponent,
  },
  {
    path: 'add-certification',
    component: AddCertificationComponent,
},
{
  path: 'update-certification/:id/:r',
  component: AddCertificationComponent,
},

];

@NgModule({
  declarations: [CertificationComponent,AddCertificationComponent],
  imports: [
    CommonModule ,  
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgxDatatableModule,
    ContentHeaderModule,
    PhoneMaskDirectiveModule,
    SharedpipeModule,
    CustomDateTimePipeModule, 

  ]
})
export class CertificationModule { }
