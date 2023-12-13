import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { SharedCalenderComponent } from './shared-calender.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
FullCalendarModule.registerPlugins([ 
  interactionPlugin,
  dayGridPlugin
]);


@NgModule({
  declarations: [
    SharedCalenderComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
    NgxDatatableModule,
     FullCalendarModule,
     ContentHeaderModule
  ],
  exports:[
    SharedCalenderComponent

  ]
})
export class SharedCalenderModule { }
