import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpendDownComponent } from './spend-down.component';
import { AddSpendDownComponent } from './add-spend-down/add-spend-down.component';
import { AuthGuard } from 'app/auth/helpers';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

const routes = [
  {
    path: '',
    component:SpendDownComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-spendDown',
    component: AddSpendDownComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-spendDown/:id/:name',
    component: AddSpendDownComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [SpendDownComponent, AddSpendDownComponent],
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
export class SpendDownModule { }
