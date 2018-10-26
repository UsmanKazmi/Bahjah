import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmpasswordPage } from './confirmpassword';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from '../selectedcard/selectedcard.module';

@NgModule({
  declarations: [
    ConfirmpasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmpasswordPage),
    TranslateModule.forChild({loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] }}),

  ],
})
export class ConfirmpasswordPageModule {}
