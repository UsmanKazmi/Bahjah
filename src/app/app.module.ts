import { ChangepasswordPage } from './../pages/changepassword/changepassword';
import { ScanqrPage } from './../pages/scanqr/scanqr';
// import { SelectedcardPage } from './../pages/selectedcard/selectedcard';
import { WalletselectedcardPage } from './../pages/walletselectedcard/walletselectedcard';
import { UsedcardsPage } from './../pages/usedcards/usedcards';
import { PayPage } from './../pages/pay/pay';
import { AddcardPage } from './../pages/addcard/addcard';
import { CardaddedPage } from './../pages/cardadded/cardadded';
import { WalletPage } from './../pages/wallet/wallet';
import { EditaccountPage } from './../pages/editaccount/editaccount';
import { BuycardconfirmPage } from './../pages/buycardconfirm/buycardconfirm';
import { BuycardgiftcardPage } from './../pages/buycardgiftcard/buycardgiftcard';
import { BuycardpaymentPage } from './../pages/buycardpayment/buycardpayment';
import { AccountsPage } from './../pages/accounts/accounts';
import { SearchtwoPage } from './../pages/searchtwo/searchtwo';
import { SearchPage } from './../pages/search/search';
import { TabsPage } from '../pages/tabs/tabs';
import { NetworkInterface } from '@ionic-native/network-interface';
import { CommonModule } from '@angular/common';

import { ResetpasswordPage } from './../pages/resetpassword/resetpassword';

import { RegistrationtwoPage } from './../pages/registrationtwo/registrationtwo';
import { RegistrationPage } from './../pages/registration/registration';
import { TutorialPage } from './../pages/tutorial/tutorial';
import { MaintwoPage } from './../pages/maintwo/maintwo';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule,enableProdMode  } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from "@angular/http";
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { CallNumber } from '@ionic-native/call-number';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { WorkstatusmodalPage} from '../pages/workstatusmodal/workstatusmodal';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { GridmodalPage } from '../pages/gridmodal/gridmodal';
import { FiltermodalPage } from '../pages/filtermodal/filtermodal';
import { GeneralService } from '../providers/general-service/GeneralService';
import { SendtofriendPage } from '../pages/sendtofriend/sendtofriend';
import { SendtowalletPage } from '../pages/sendtowallet/sendtowallet';
import { BuycardcheckoutPage } from '../pages/buycardcheckout/buycardcheckout';
import { BuycarddetailsPage } from '../pages/buycarddetails/buycarddetails';
import { IonicStorageModule } from '@ionic/storage';
import { ProductPage } from '../pages/product/product';
import { QRScanner } from '@ionic-native/qr-scanner';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { WishlistPage } from './../pages/wishlist/wishlist';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AddcardsuccessPage } from '../pages/addcardsuccess/addcardsuccess';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { QrmodalPage } from '../pages/qrmodal/qrmodal';
import { ThemeableBrowser} from '@ionic-native/themeable-browser'
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Deeplinks } from '@ionic-native/deeplinks'
import { PaytabProvider } from '../providers/paytab/paytab';
import { DeviceFeedback } from '@ionic-native/device-feedback';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}




@NgModule({

  declarations: [
    ChangepasswordPage,ScanqrPage,QrmodalPage,AddcardsuccessPage,WalletselectedcardPage,WishlistPage,UsedcardsPage,MyApp,PayPage,ProductPage,CardaddedPage,AddcardPage,WalletPage,BuycardpaymentPage,BuycardgiftcardPage,BuycardconfirmPage,SendtowalletPage,EditaccountPage,
    AccountsPage,HomePage,BuycarddetailsPage,LoginPage,MaintwoPage,TutorialPage,RegistrationPage,SendtofriendPage,SendtowalletPage,BuycardcheckoutPage,
    RegistrationtwoPage,ResetpasswordPage,TabsPage,WorkstatusmodalPage,FiltermodalPage,GridmodalPage,SearchPage,SearchtwoPage
  ],
  imports: [
    BrowserModule,CommonModule,
    HttpModule,NgxQRCodeModule,
    HttpClientModule,
    TranslateModule.forRoot({loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] }}),
    IonicModule.forRoot(MyApp, { scrollAssist: false, autoFocusAssist: false }),
    IonicStorageModule.forRoot({
      name: '__bdb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']

    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ChangepasswordPage,ScanqrPage,QrmodalPage,AddcardsuccessPage,WalletselectedcardPage,WishlistPage,UsedcardsPage,WalletPage,PayPage,ProductPage,CardaddedPage,AddcardPage,AccountsPage,MyApp,BuycardpaymentPage,BuycardgiftcardPage,BuycardconfirmPage,SendtowalletPage,EditaccountPage,
    HomePage,BuycarddetailsPage,LoginPage,MaintwoPage,TutorialPage,RegistrationPage,SendtofriendPage,SendtowalletPage,BuycardcheckoutPage,
    RegistrationtwoPage,ResetpasswordPage,TabsPage,WorkstatusmodalPage,FiltermodalPage,GridmodalPage,SearchPage,SearchtwoPage
  ],
  providers: [

    InAppBrowser,SocialSharing,NetworkInterface,ThemeableBrowser,NativePageTransitions,LaunchNavigator,Deeplinks,CallNumber,
    StatusBar,QRScanner,DeviceFeedback,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GeneralService,
    PaytabProvider
  ]

}


)
export class AppModule {}
enableProdMode();
