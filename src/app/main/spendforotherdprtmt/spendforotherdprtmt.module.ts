import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/auth/helpers';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SpendforotherdprtmtComponent } from './spendforotherdprtmt.component';
import { AddspendforotherdprtmtComponent } from './addspendforotherdprtmt/addspendforotherdprtmt.component';

const routes = [
  {
    path: '',
    component:SpendforotherdprtmtComponent,
    canActivate: [AuthGuard],
  },
{
  path: 'add-spend-for-other-department',
  component: AddspendforotherdprtmtComponent,
  canActivate: [AuthGuard],
},
{
  path: 'edit-spend-for-other-department/:id/:name',
  component: AddspendforotherdprtmtComponent,
  canActivate: [AuthGuard],
},
];


@NgModule({
  declarations: [SpendforotherdprtmtComponent, AddspendforotherdprtmtComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    NgImageFullscreenViewModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgxDatatableModule,
    ContentHeaderModule,
    NgMultiSelectDropDownModule
  ]
})
export class SpendforotherdprtmtModule { }
