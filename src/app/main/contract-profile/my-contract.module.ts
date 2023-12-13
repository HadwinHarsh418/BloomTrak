import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { AuthGuard } from 'app/auth/helpers';

import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MyContractService } from './my-contract.service';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgxPrintModule } from 'ngx-print';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { ContractProfileComponent, FormatTimePipe } from './contract-profile.component';
import { SharedCalenderModule } from '../shared-calender/shared-calender.module';
import { SharedModule } from 'app/auth/helpers/timer.pipe';


const routes = [
    {
        path: '',
        component: ContractProfileComponent,
        canActivate: [AuthGuard],
    },

];

@NgModule({
    declarations: [ContractProfileComponent,FormatTimePipe],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TranslateModule,
        NgbModule,
        NgImageFullscreenViewModule,
        PerfectScrollbarModule,
        CoreCommonModule,
        NgxDatatableModule,
        ContentHeaderModule,
        Ng2FlatpickrModule,
        NgxPrintModule,
        SharedCalenderModule,
        SharedModule

    ],
    providers: [MyContractService],
    exports: [ContractProfileComponent]
})
export class MyContractModule { }
