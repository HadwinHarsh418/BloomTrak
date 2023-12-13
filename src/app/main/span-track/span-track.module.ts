import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpanTrackComponent } from './span-track.component';
import { AuthGuard } from 'app/auth/helpers';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { AddMenuComponent } from './add-menu/add-menu.component';

const routes = [
  {
    path: '',
    component: SpanTrackComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'add-menu',
    component: AddMenuComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'edit-menu/:id/:name',
    component: AddMenuComponent,
    canActivate: [AuthGuard],
  },

];

@NgModule({
  declarations: [SpanTrackComponent, AddMenuComponent],
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
export class SpanTrackModule { }
