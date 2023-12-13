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
import { FixedExpenceTabComponent } from './fixed-expence-tab.component';
import { AddFixedExpenceTabComponent } from './add-fixed-expence-tab/add-fixed-expence-tab.component';

const routes = [
  {
    path: '',
    component: FixedExpenceTabComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-fixed-expence',
    component: AddFixedExpenceTabComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-fixed-expence/:id',
    component: AddFixedExpenceTabComponent,
    canActivate: [AuthGuard],
  },
 ];


@NgModule({
  declarations: [FixedExpenceTabComponent, AddFixedExpenceTabComponent],
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
export class FixedExpenceTabModule { }
