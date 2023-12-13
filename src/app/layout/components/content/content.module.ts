import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoreCommonModule } from '@core/common.module';
import { TranslateModule } from '@ngx-translate/core';

import { ContentComponent } from 'app/layout/components/content/content.component';
import { ToastrModule } from 'ng6-toastr-notifications';
import { Ng5SliderModule } from 'ng5-slider';

@NgModule({
  declarations: [ContentComponent],
  entryComponents:[],
  imports: [RouterModule, CoreCommonModule, TranslateModule, ToastrModule,  Ng5SliderModule],
  exports: [ContentComponent]
})
export class ContentModule {}
