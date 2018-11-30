import { ViewChild } from '@angular/core';
import { Navbar, Nav, Tabs, Alert, ToastController } from 'ionic-angular';
import { AccountsPage } from './../pages/accounts/accounts';
import { SelectedcardPage } from './../pages/selectedcard/selectedcard';
import { HomePage } from './../pages/home/home';
import { ProductPage } from './../pages/product/product';
import {  Deeplinks } from '@ionic-native/deeplinks';
import { LoginPage } from './../pages/login/login';
import { TabsPage } from './../pages/tabs/tabs';
import { TutorialPage } from './../pages/tutorial/tutorial';
import { TranslateService } from '@ngx-translate/core';

import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { GeneralService } from '../providers/general-service/GeneralService';


@Component({

  templateUrl: 'app.html'

})

export class MyApp {
  @ViewChild(Nav) navChild:Nav;


   currentLang:string = "en";
  // public alertShown:boolean = false;
  static loadingDataText :string;
  rootPage:any = "";
  static loadingText: any;
  static translatedText: any;
  static alertExitTitle: any;
  static addFavText: any;
  static removedFavText: any;
  static proceedToCheckOutText: any;
  static cardNotVerifiedText: any;
  static verifyText: any;
  static fieldEmptyText: any;
  static loggedOutText: any;
  static loggingInText: any;
  static loggedInText: any;
  static okayText: any;
  static allFieldsReqText: any;
  static checkEmailText: any;
  static registeringText: any;
  static alertMessageText: any;
  static alertCancelText: any;
  static yesText: any;
  static errorText: any;
  static chooseGiftCardText: any;
  static passwordDontMatchText: any;
  static emailAlreadyExistText: any;
  static invalidPhone: any;
  method: string;
  request: string;
  loadingCtrl: any;
  dataList: any;
  data: any;
  static emailSentText: any;
  static success: any;
  static alreadyLoggedIn: any;
    static needToLoginFirstText: any;
  static passwordAlreadyUsedText: any;
  static invalidLink: any;
  static wrongOldPassword: any;
  static signInAgain: any;
  static successfullyUpdatedText: any;
  static finishingOrderText: any;
  static emailNotFound: any;

  constructor(public generalService:GeneralService, public toastCtrl: ToastController ,public alertCtrl:AlertController,private platform: Platform,private translate: TranslateService,  statusBar: StatusBar, splashScreen: SplashScreen, storage: Storage, private deeplinks:Deeplinks) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.overlaysWebView(false);
      statusBar.hide();
      splashScreen.hide();





      storage.get('page').then((value) => {
        if (value == "TabsPage") {
          this.rootPage = TabsPage;
        } else if (value == "LoginPage") {
          this.rootPage = LoginPage;
        } else {
          this.rootPage = TutorialPage;
        }
        this.deeplinks.routeWithNavController(this.navChild,{


        }).subscribe(match => {

          //  alert(JSON.stringify(match));


          let checkIndex =  match.$link.queryString.split(/=|&/);

          if(checkIndex[0]=='https://bahjahcards.com/passwordrecovery/confirm?token' || checkIndex[0]=='token'){
            storage.get("usr").then((usr) => {
              storage.get("pwd").then((pwd) => {
                if(usr || pwd){
                let toast = this.toastCtrl.create({
                  //assigning the Success message to toast
                  message: MyApp.alreadyLoggedIn,
                  cssClass: 'mytoast',
                  duration: 3500
                });
                toast.present(toast);
              } else {
                this.navChild.push('ConfirmpasswordPage',{
                  token:checkIndex[1],
                  email:checkIndex[3]
                });
              }
              });
            });
          }
          else if (checkIndex[0]=='productId'){

            storage.get("usr").then((usr) => {
              storage.get("pwd").then((pwd) => {
                if(usr || pwd){
                  let lastIndex= match.$link.queryString.lastIndexOf( '=' );
                  lastIndex = match.$link.queryString.substring(lastIndex+1)
                  this.navChild.push('SelectedcardPage',{
                    pId:lastIndex,
                  });
              } else {
                let toast = this.toastCtrl.create({
                  //assigning the Success message to toast
                  message: MyApp.needToLoginFirstText,
                  cssClass: 'mytoast',
                  duration: 3500
                });
                toast.present(toast);
              }
              });
            });

          }

            //DeepLink check for opening AddCardSerialPage
          else if (checkIndex[0]=='https://bahjahcards.com/bahjah?serial' || checkIndex[0]=='serial'){

            storage.get("usr").then((usr) => {
              storage.get("pwd").then((pwd) => {
                if(usr || pwd){
                  let lastIndex= match.$link.queryString.lastIndexOf( '=' );
                  lastIndex = match.$link.queryString.substring(lastIndex+1)
                  this.navChild.push('AddcardserialPage',{
                    couponCode:lastIndex,
                  });
              } else {

                //if the user is not logged in
                let toast = this.toastCtrl.create({
                  message: MyApp.needToLoginFirstText,
                  cssClass: 'mytoast',
                  duration: 3500
                });
                toast.present(toast);
                this.navChild.setRoot(LoginPage);
              }
              });
            });

          }


          else {
            this.navChild.push(TabsPage);

          }

          console.log('Successfully matched route', match);

        }, nomatch => {

          let toast = this.toastCtrl.create({
            message: MyApp.invalidLink,
            cssClass: 'mytoast',
            duration: 3500
          });
          toast.present(toast);
          // nomatch.$link - the full link data

          console.error('Got a deeplink that didn\'t match', nomatch);

          // alert(JSON.stringify(nomatch))


        });
      });

      storage.get('lang').then((value) => {
        if (value == "en") {
          this.currentLang = "en";
          this.initTranslate(this.currentLang);
          this.translateLoadingText(this.currentLang);


        } else {
          this.currentLang = "ar";
          this.initTranslate(this.currentLang);
          this.translateLoadingText(this.currentLang);


        }
      });






    });


  }
  ionViewDidLoad(){


  }

  initTranslate(lang) {
    // Set the default language for translation strings, and the current language.

    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    if (lang == "ar") {
      this.platform.setDir('rtl',true);
    } else {
      this.platform.setDir('ltr', true);
    }
        // this.translate.get(['loadingDataText']).subscribe(values => {
        // });

  }




  translateLoadingText(lang){
    this.translate.setDefaultLang(lang);

  this.translate.get('loadingDataText').subscribe(
      value => {
        // value is our translated string
         MyApp.loadingDataText = value;
      }
    )

  this.translate.get('confirmExitText').subscribe(
    value => {
      // value is our translated string
       MyApp.alertExitTitle = value;
    }


)
this.translate.get('loadingText').subscribe(
  value => {
    // value is our translated string
     MyApp.loadingText = value;
  }


)

this.translate.get('addedToFavText').subscribe(
  value => {
    // value is our translated string
     MyApp.addFavText = value;
  }


)
this.translate.get('signInAgain').subscribe(
  value => {
    // value is our translated string
     MyApp.signInAgain = value;
  }


)
this.translate.get('signInAgain').subscribe(
  value => {
    // value is our translated string
     MyApp.signInAgain = value;
  }


)
this.translate.get('emailNotFound').subscribe(
  value => {
    // value is our translated string
     MyApp.emailNotFound = value;
  }


)
this.translate.get('finishingOrderText').subscribe(
  value => {
    // value is our translated string
     MyApp.finishingOrderText = value;
  }


)



this.translate.get('removedFromFavText!').subscribe(
  value => {
    // value is our translated string
     MyApp.removedFavText = value;
  }


)
this.translate.get("addedToCart").subscribe(
  value => {
    // value is our translated string
     MyApp.proceedToCheckOutText = value;
  }



)
this.translate.get("needToLoginFirstText").subscribe(
  value => {
    // value is our translated string
     MyApp.needToLoginFirstText = value;
  }



)

this.translate.get('cardNotVerified').subscribe(
  value => {
    // value is our translated string
     MyApp.cardNotVerifiedText = value;
  }


)
this.translate.get('passwordAlreadyUsedText').subscribe(
  value => {
    // value is our translated string
     MyApp.passwordAlreadyUsedText = value;
  }


)
this.translate.get('verifyingCouponText').subscribe(
  value => {
    // value is our translated string
     MyApp.verifyText = value;
  }


)
this.translate.get('fieldsCannotbeEmpty').subscribe(
  value => {
    // value is our translated string
     MyApp.fieldEmptyText = value;
  }



)
this.translate.get('loggedOutText').subscribe(
  value => {
    // value is our translated string
     MyApp.loggedOutText = value;
  }



)
this.translate.get('loggingIntext').subscribe(
  value => {
    // value is our translated string
     MyApp.loggingInText = value;
  }



)
this.translate.get('OK').subscribe(
  value => {
    // value is our translated string
     MyApp.okayText = value;
  }



)
this.translate.get('invalidPhone').subscribe(
  value => {
    // value is our translated string
     MyApp.invalidPhone = value;
  }



)

this.translate.get('successfullyloginText').subscribe(
  value => {
    // value is our translated string
     MyApp.loggedInText = value;
  }



)
this.translate.get('fieldsRequiredText').subscribe(
  value => {
    // value is our translated string
     MyApp.allFieldsReqText = value;
  }



)
this.translate.get('checkEmailText').subscribe(
  value => {
    // value is our translated string
     MyApp.checkEmailText = value;
  }



)

this.translate.get('checkEmailText').subscribe(
  value => {
    // value is our translated string
     MyApp.registeringText = value;
  }



)
this.translate.get('doYouconfirmExitText').subscribe(
  value => {
    // value is our translated string
     MyApp.alertMessageText= value;
  }



)
this.translate.get('cancel').subscribe(
  value => {
    // value is our translated string
     MyApp.alertCancelText= value;
  }



)
this.translate.get('yes').subscribe(
  value => {
    // value is our translated string
     MyApp.yesText= value;
  }



)
this.translate.get('errorConnectText').subscribe(
  value => {
    // value is our translated string
     MyApp.errorText= value;
  }



)
this.translate.get('success').subscribe(
  value => {
    // value is our translated string
     MyApp.success= value;
  }



)
this.translate.get('chooseGiftCardText').subscribe(
  value => {
    // value is our translated string
     MyApp.chooseGiftCardText= value;
  }



)
this.translate.get('passwordDontMatchText').subscribe(
  value => {
    // value is our translated string
     MyApp.passwordDontMatchText= value;
  }



)
this.translate.get('emailAlreadyExistText').subscribe(
  value => {
    // value is our translated string
     MyApp.emailAlreadyExistText= value;
  }



)
this.translate.get('emailSentText').subscribe(
  value => {
    // value is our translated string
     MyApp.emailSentText
     = value;
  }



)
this.translate.get('alreadyLoggedIn').subscribe(
  value => {
    // value is our translated string
     MyApp.alreadyLoggedIn
     = value;
  }



)
this.translate.get('invalidLink').subscribe(
  value => {
    // value is our translated string
     MyApp.invalidLink = value;
  }


)
this.translate.get('wrongOldPassword').subscribe(
  value => {
    // value is our translated string
     MyApp.wrongOldPassword = value;
  }


)
this.translate.get('successfullyUpdatedText').subscribe(
  value => {
    // value is our translated string
     MyApp.successfullyUpdatedText = value;
  }


)


  }







}
