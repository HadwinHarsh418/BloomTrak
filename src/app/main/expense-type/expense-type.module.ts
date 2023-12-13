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
import { ExpenseTypeComponent } from './expense-type.component';
import { AddTypeComponent } from './add-type/add-type.component';

const routes = [
  {
    path: '',
    component: ExpenseTypeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-type',
    component: AddTypeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-type/:id/:name',
    component: AddTypeComponent,
    canActivate: [AuthGuard],
  },
 ];

@NgModule({
  declarations: [ExpenseTypeComponent, AddTypeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    NgImageFullscreenViewModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgxDatatableModule,
    ContentHeaderModule,
 
  ]
})
export class ExpenseTypeModule { }
