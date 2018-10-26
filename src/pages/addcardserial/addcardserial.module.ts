import { AddcardserialPage } from './addcardserial';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateHttpLoader } from '../../../node_modules/@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AddcardserialPage,
  ],
  imports: [
    IonicPageModule.forChild(AddcardserialPage),
    TranslateModule.forChild({loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] }}),

  ],
})
export class AddcardserialPageModule {

}
