import { NgModule } from '@angular/core';

import { FeatherIconDirective } from '@core/directives/core-feather-icons/core-feather-icons';
import { RippleEffectDirective } from '@core/directives/core-ripple-effect/core-ripple-effect.directive';
import { InputDirective } from './input-directive/input-directive';

@NgModule({
  declarations: [RippleEffectDirective, FeatherIconDirective, InputDirective],
  exports: [RippleEffectDirective, FeatherIconDirective, InputDirective]
})
export class CoreDirectivesModule {}
