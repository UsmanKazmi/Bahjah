import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Plugin,Cordova,CordovaProperty,CordovaInstance,IonicNativePlugin} from '@ionic-native/core'






@Plugin(
  {
    pluginName: "paytab",
    plugin: "cordova-plugin-paytab",
    pluginRef: "paytab",
    repo: 'https://github.com/Kunwar-Adeel/Ionic-Paytabs',
    platforms: ['Android','iOS']
  }
)

@Injectable()
export class PaytabProvider {


  @Cordova()
  add(arg1:any): Promise<object>{
    return;
  }
  substract(arg1:any): Promise<object>{
    return;
  }


}
