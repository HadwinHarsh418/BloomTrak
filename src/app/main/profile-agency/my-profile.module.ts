import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AuthGuard } from 'app/auth/helpers';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MyProfileService } from './my-profile.service';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgxPrintModule } from 'ngx-print';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { ProfileAgencyComponent } from './profile-agency.component';
import { PhoneMaskDirectiveModule } from 'app/auth/helpers/phone-mask.directive';
import { SharedpipeModule } from 'app/auth/helpers/sharedpipe/sharedpipe.module';
import { SwithButtonModule } from '../switch-button/swith-button/swith-button.module';


const routes = [
    {
        path: '',
        component: ProfileAgencyComponent,
        canActivate: [AuthGuard],
    },

];

@NgModule({
    declarations: [ProfileAgencyComponent],
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
        PhoneMaskDirectiveModule,
        SharedpipeModule,
        Ng2FlatpickrModule,
        NgxPrintModule,
        SwithButtonModule

    ],
    providers: [MyProfileService],
    exports: [ProfileAgencyComponent]
})
export class MyProfileModule { }
