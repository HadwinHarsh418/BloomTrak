import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddLedgerComponent } from './add-ledger/add-ledger.component';
import { AuthGuard } from 'app/auth/helpers';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { GeneralLedgerComponent } from './general-ledger.component';
import { TranslateModule } from '@ngx-translate/core';

const routes = [
  {
    path: '',
    component: GeneralLedgerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-ledger',
    component: AddLedgerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-ledger/:id',
    component: AddLedgerComponent,
    canActivate: [AuthGuard],
  },
];


@NgModule({
  declarations: [AddLedgerComponent,GeneralLedgerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    NgImageFullscreenViewModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgxDatatableModule,
    ContentHeaderModule,
    TranslateModule

  ]
})
export class GeneralLedgerModule { }
