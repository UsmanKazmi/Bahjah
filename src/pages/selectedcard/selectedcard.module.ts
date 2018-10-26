import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectedcardPage } from './selectedcard';
import { TranslateHttpLoader } from '../../../node_modules/@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    SelectedcardPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectedcardPage),
    TranslateModule.forChild({loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] }}),

  ],
})
export class SelectedcardPageModule {

}
