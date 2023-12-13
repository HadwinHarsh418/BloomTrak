import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { PositionComponent } from './position.component';
import { AddPositionComponent } from './add-position/add-position.component';
import { EditPositionComponent } from './edit-position/edit-position.component';

const routes = [
  {
      path: '',
      component: PositionComponent,
      canActivate: [AuthGuard],
  },{
    path: 'addPosition',
    component: AddPositionComponent,
    canActivate: [AuthGuard],
},{
  path: 'editPosition/:id/:n',
  component: EditPositionComponent,
  canActivate: [AuthGuard],
},
];

@NgModule({
  declarations: [PositionComponent, AddPositionComponent,EditPositionComponent],
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
export class PositionModule { }
