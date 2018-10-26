import { TabsPage } from './../tabs/tabs';
import { NativePageTransitions,NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { HomePage } from './../home/home';
import { UsedcardsPage } from './../usedcards/usedcards';
import { WishlistPage } from './../wishlist/wishlist';
import { LoginPage } from './../login/login';
import { GeneralService } from './../../providers/general-service/GeneralService';
import { FormBuilder } from '@angular/forms';
import { EditaccountPage } from "./../editaccount/editaccount";
import { Component } from "@angular/core";
import { IonicPage, LoadingController, NavController, NavParams, ToastController,App,Platform } from "ionic-angular";
import { TranslateService } from "../../../node_modules/@ngx-translate/core";
import { Storage } from "@ionic/storage";
import { MyApp } from '../../app/app.component';


/**
 * Generated class for the AccountsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-accounts",
  templateUrl: "accounts.html"
})
export class AccountsPage {
  username: any = [];
  password: any = [];
  public buttonColor: string = "transparent";


  static dataFromFirstName: any = [];
  static dataFromLastName: any = [];
  static dataFromPhoneNumber: any = [];
  static dataFromEmail: any = [];
  static dataFromPassword: any = [];
  static dataFromCustId: any = [];
  public hidelanguageButton=undefined;

  FirstName: any = "";
  LastName: any = "";
  PhoneNumber: any = "";
  Email: any = "";
  Password: any = "";
  custID: any = "";




  method: string = "";
  request: string = "";
  dataList: any = "";
  data: any = [];
  unregisterBackButtonAction: any;

  constructor(public nativePageTransitions:NativePageTransitions,public platform:Platform,public app: App,public toastCtrl:ToastController ,public loadingCtrl: LoadingController, public generalService: GeneralService, private storage: Storage, public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService
  ) {



    // let username: any = "";
    let password: any = "";

    this.storage.get("usr").then(usr => {
      this.username = usr;
      this.storage.get("pwd").then(pwd => {
        this.password = pwd;

        // this.getProfileDataService(this.username,this.password);







      });
    });


          this.FirstName = HomePage.dataFromFirstName;

          this.LastName = HomePage.dataFromLastName;

          this.PhoneNumber = HomePage.dataFromPhoneNumber;

          this.Email = HomePage.dataFromEmail;

          this.custID = HomePage.dataFromCustId;

          this.password = HomePage.dataFromPassword;

          //   this.dataFromFirstName = this.dataList.aFirstName
    console.log("Username is", this.username);
    console.log("Password is", this.password);
    console.log("FirstNAme is", this.FirstName);
    console.log("LastName is", this.LastName);
    console.log("PhoneNumber is", this.PhoneNumber);
    console.log("Email is", this.Email);


    console.log("TAB INDEX IS",TabsPage.tabIndex)


  }
  getProfileDataService(username,password){

    // this.method = "GetCustomerInfo";
    // // assigning values of signup form to request soap
    // this.request = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\"> <soapenv:Header/> <soapenv:Body> <tem:GetCustomerInfo> <tem:usernameOrEmail>" + username + "</tem:usernameOrEmail> <tem:userPassword>" + password + "</tem:userPassword> </tem:GetCustomerInfo> </soapenv:Body> </soapenv:Envelope>"

    // let loader = this.loadingCtrl.create({
    //   content: "loadingDataText"
    // });
    // loader.present();

    // this.generalService.webService(this.request, this.method).then(
    //   response => {
    //     this.dataList = response;
    //     this.data = this.dataList;
    //     console.log(response);
    //     loader.dismiss();

    //     if (this.dataList.statusText == "OK") {
    //       console.log("DATA HAS BEEN FETCHED");

    //       this.dataList = JSON.parse(this.dataList._body);

    //       AccountsPage.dataFromFirstName = this.dataList.aFirstName
    //       this.FirstName = AccountsPage.dataFromFirstName;

    //       AccountsPage.dataFromLastName = this.dataList.aLastName;
    //       this.LastName = AccountsPage.dataFromLastName;

    //       AccountsPage.dataFromPhoneNumber = this.dataList.aPhone;
    //       this.PhoneNumber = AccountsPage.dataFromPhoneNumber;

    //       AccountsPage.dataFromEmail = this.dataList.aEmail;
    //       this.Email = AccountsPage.dataFromEmail;

    //       AccountsPage.dataFromCustId = this.dataList.aCustomerId;
    //       this.custID = AccountsPage.dataFromCustId;

    //       AccountsPage.dataFromPassword = this.password;
    //       this.password = AccountsPage.dataFromPassword;

    //       //   this.dataFromFirstName = this.dataList.aFirstName

    //       console.log(this.dataList);
    //     } else {
    //     }
    //   },
    //   error => {
    //     console.log(error);
    //     alert("Error connecting to the network");
    //   }
    // );


  }
  setLanguageService(id){

      this.method = "SetLanguage";
    // assigning values of signup form to request soap
    this.request = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"> <Body> <SetLanguage xmlns="http://tempuri.org/"> <usernameOrEmail>'+HomePage.dataFromEmail+'</usernameOrEmail> <userPassword>'+HomePage.dataFromPassword+'</userPassword> <langid>'+id+'</langid> </SetLanguage> </Body> </Envelope>'

    let loader = this.loadingCtrl.create({
      content: MyApp.loadingDataText
    });
    loader.present();

    this.generalService.webService(this.request, this.method).then(
      response => {
        this.dataList = response;
        this.data = this.dataList;
        console.log(response);
        loader.dismiss();

        if (this.dataList.statusText == "OK") {
          console.log("DATA HAS BEEN FETCHED");

          this.dataList = JSON.parse(this.dataList._body);


          console.log(this.dataList);
          //  this.navCtrl.getByIndex(0)
          // // this.navCtrl.setRoot(TabsPage);
          // this.navCtrl.parent.select(0);
          window.location.reload();

        }
      },
      error => {
        console.log(error);
        alert(MyApp.errorText);
      }
    );
  }

  logout() {

    this.app.getRootNav().setRoot(LoginPage);

    this.storage.ready().then(() => {
      this.storage.clear();
      this.storage.set('page','LoginPage');
    });

    let toast = this.toastCtrl.create({
      //assigning the Success message to toast
      message: MyApp.loggedOutText,
      cssClass: 'mytoast',
      duration: 3500
    });
    toast.present(toast);
  }

  public gotoEditAccountPage() {
    // let options: NativeTransitionOptions = {
    //   direction: 'left',
    //   duration: 400,
    //   slowdownfactor: -1,
    //   iosdelay: 50,
    //   androiddelay:50,


    //  };

    // this.nativePageTransitions.slide(options);
    this.navCtrl.push(EditaccountPage);

  }

  openUsedCardsPage(){
    // let options: NativeTransitionOptions = {
    //   direction: 'left',
    //   duration: 400,
    //   slowdownfactor: -1,
    //   iosdelay: 50,
    //   androiddelay:50,


    //  };

    // this.nativePageTransitions.slide(options);
    this.navCtrl.push(UsedcardsPage);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AccountsPage");
  }

  ionViewWillEnter() {
    document.getElementById("languageRow").className = "hideLanguageButton";

  }
   public english() {

    this.platform.setDir('ltr', true);
    this.translate.use("en"); // Set your language here
    this.storage.set('lang','en');
    this.translate.setDefaultLang("en");
    // document.getElementById("arabButtonId").className = "transparent-button";
    this.setLanguageService(1);

  }

  public arabic() {

    this.platform.setDir('rtl', true);
    this.translate.use("ar"); // Set your language here
    this.storage.set('lang','ar');
    this.translate.setDefaultLang("ar");


    // document.getElementById("englishButtonId").className = "transparent-button";
    console.log("covert to arabic");
    this.setLanguageService(2);


  }

  hideButton(){
    console.log("DEFAULT STATE OF THE LANGUAGE BUTTON",this.hidelanguageButton)

    if(this.hidelanguageButton==false){
    document.getElementById("languageRow").className = "hideLanguageButton";
    console.log("IF hidelanguageButton false ",this.hidelanguageButton)
    this.hidelanguageButton=true;

    }
    else{
      document.getElementById("languageRow").className = "showLanguageButton";
      console.log("IF hidelanguageButton true ",this.hidelanguageButton)
      this.hidelanguageButton=false;

    }


  }

  openEditPage() {
    // let options: NativeTransitionOptions = {
    //   direction: 'left',
    //   duration: 400,
    //   slowdownfactor: -1,
    //   iosdelay: 50,
    //   androiddelay:50,


    //  };

    // this.nativePageTransitions.slide(options);
    this.navCtrl.push(EditaccountPage);
  }
  openWishList(){
    // let options: NativeTransitionOptions = {
    //   direction: 'left',
    //   duration: 400,
    //   slowdownfactor: -1,
    //   iosdelay: 50,
    //   androiddelay:50,


    //  };

    // this.nativePageTransitions.slide(options);
    this.navCtrl.push(WishlistPage)
  }


  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
}


ionViewDidEnter() {
  this.initializeBackButtonCustomHandler();
}
public initializeBackButtonCustomHandler(): void {
  this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
      this.customHandleBackButton();
  }, 10);
}
private customHandleBackButton(): void {

  this.navCtrl.getByIndex(0)
  this.navCtrl.parent.select(0);
}


openHome(){
  this.navCtrl.getByIndex(0);
  this.navCtrl.parent.select(0);
}
}
