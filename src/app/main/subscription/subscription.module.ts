import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionComponent } from './subscription.component';
import { AuthGuard } from 'app/auth/helpers';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { CustomDateTimePipeModule } from 'app/auth/helpers/custom-date-time.pipe';
import { ViewSubscriptionComponent } from './view-subscription/view-subscription.component';

const routes = [
  {
    path: '',
    component: SubscriptionComponent,
    canActivate: [AuthGuard],
  },
  {path:'view/:id/:d',component:ViewSubscriptionComponent,
  canActivate: [AuthGuard]},
]


@NgModule({
  declarations: [SubscriptionComponent, ViewSubscriptionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    NgImageFullscreenViewModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgxDatatableModule,
    ContentHeaderModule,
    CustomDateTimePipeModule
  ]
})
export class SubscriptionModule { }
