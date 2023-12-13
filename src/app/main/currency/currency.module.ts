import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyComponent } from './currency.component';
import { AuthGuard } from 'app/auth/helpers';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { AddcurrencyComponent } from './addcurrency/addcurrency.component';

const routes = [
  {
    path: '',
    component: CurrencyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-currency',
    component: AddcurrencyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-currency/:id/:name',
    component: AddcurrencyComponent,
    canActivate: [AuthGuard],
  },
 

];

@NgModule({
  declarations: [CurrencyComponent, AddcurrencyComponent],
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
export class CurrencyModule { }
