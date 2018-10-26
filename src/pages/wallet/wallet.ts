import { MyApp } from './../../app/app.component';
import { HomePage } from './../home/home';
import { Platform } from 'ionic-angular';
import { TabsPage } from './../tabs/tabs';
import { App, Tabs } from 'ionic-angular';
import { QrmodalPage } from './../qrmodal/qrmodal';
import { WalletselectedcardPage } from './../walletselectedcard/walletselectedcard';
import { LoginPage } from './../login/login';
import { Storage } from '@ionic/storage';
import { GeneralService } from './../../providers/general-service/GeneralService';
import { AddcardPage } from './../addcard/addcard';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController,ModalController  } from 'ionic-angular';
import { RequestMethod } from '../../../node_modules/@angular/http';
import { empty } from '../../../node_modules/rxjs/Observer';
/**
 * Generated class for the WalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {
  @ViewChild('myTabs') tabRef: Tabs;

  username: any = "";
  password: any = "";
  data:any = [];
  test: any;
  dataFromGetProductDetails: any=[];
  aImageUrl:any=[];
  productId:any=[];
  WalletCore: any=[];
  addressIsEmpty: boolean = false;
  UrlPicture: any;
  tabIndex:any=[];
  unregisterBackButtonAction: any;

  addtoWallettext:string = "Please. press OK to add a gift card to your Wallet."

  constructor(public modalCtrl : ModalController,public storage:Storage,public navCtrl: NavController, public navParams: NavParams, public generalService:GeneralService,public loader:LoadingController,public alertCtrl: AlertController,public toastCtrl:ToastController,public platform:Platform) {
    this.tabIndex = TabsPage.tabIndex;

    this.storage.get("usr").then((usr) => {
      this.username= usr;
    });

    this.storage.get('pwd').then((pwd) => {
        this.password = pwd;
    });

    setTimeout( () => {
      if (this.username != "" && this.username != null && this.password != "" && this.password != null ) {

      } else {
        this.navCtrl.setRoot(LoginPage);

      }
    }, 500);
    console.log("TAB INDEX IS",TabsPage.tabIndex)

  }


  getCustWalletSevice(username,password){

    let loader = this.loader.create({
      content: MyApp.loadingDataText
    });
    loader.present();

    let requestCategory = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"> <Body> <GetCustomerWallet xmlns="http://tempuri.org/"> <usernameOrEmail>'+username+'</usernameOrEmail> <userPassword>'+password+'</userPassword> </GetCustomerWallet> </Body> </Envelope>';
    let methodCategory = 'GetCustomerWallet';

    this.generalService.webService(requestCategory,methodCategory).then(response => {

      this.data = response;

      this.data = JSON.parse(this.data._body);

      if(this.ObjectIsEmpty(this.data)) {
        console.log("DATA EMPTY");

        //alert to move to addwallet page
        //this.walletPopup("Your wallet is Empty!",this.addtoWallettext,"Cancel","Add");
        this.addressIsEmpty = true;





      } else {
        if (this.data.aWebServiceWallet.length > 0) {
          this.WalletCore= this.data.aWebServiceWallet;

        } else {
            this.WalletCore['0']=this.data.aWebServiceWallet;
        }
      }




      // if (this.data.aWebServiceWallet) {
      //   this.WalletCore= this.data.aWebServiceWallet;
      // } else {
      //   // this.addressIsEmpty = true;
      // }


      loader.dismiss();

      // this.UrlPicture=this.WalletCore.UrlPicture;

      //loop for calling prodductDetailService inside each index

      // for(var i in this.WalletCore){
      //   console.log(this.WalletCore[i]);//This will print the objects
        //This will print the index of the objects
        // this.productId= this.WalletCore[i].aProductId;

        // setTimeout( () => {

            // this.GetProductDetails(this.username,this.password,this.productId);


        // }, 1000);


     // this.productId =this.data.aWalletCore.aProductId;








    },error => {

      loader.dismiss();
      let alert = this.alertCtrl.create({
        title:MyApp.errorText,
        buttons:['OK']
      });
      alert.present();

      return false;
    }

    )





  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletPage');
  }

  public GetProductDetails (username,password,productId) {
    let requestDetail = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/"> <soapenv:Header/> <soapenv:Body> <tem:GetProductDetails> <tem:usernameOrEmail>'+username+'</tem:usernameOrEmail> <tem:userPassword>'+password+'</tem:userPassword> <tem:productId>'+productId+'</tem:productId> </tem:GetProductDetails> </soapenv:Body> </soapenv:Envelope>';
    let methodDetail = 'GetProductDetails';


    let loader = this.loader.create({
      content: MyApp.loadingDataText
    });
    loader.present();
    this.generalService.webService(requestDetail,methodDetail).then(response => {
    this.dataFromGetProductDetails = response;
    this.dataFromGetProductDetails = JSON.parse(this.dataFromGetProductDetails._body);
    console.log(this.dataFromGetProductDetails);

    loader.dismiss();



  }, error =>{
      alert( MyApp.errorText);
  });

}
  addWallet(){
    this.navCtrl.setRoot(AddcardPage);
    this.navCtrl.parent.select(2);

  }
  generateQRCode(event,item){
    let modal = this.modalCtrl.create(QrmodalPage, {data: item});
    modal.present();
  }

  public ObjectIsEmpty(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
    return true;
  }


  // walletPopup(title,message,b1,b2) {
  //   let alert = this.alertCtrl.create({
  //     title: title,
  //     message: message,
  //     buttons: [
  //       {
  //         text: b1,
  //         role: 'cancel',
  //         handler: () => {
  //        this.addressIsEmpty = true;
  //   }
  //       },
  //       {
  //         text: b2,
  //         handler: () => {
  //           this.navCtrl.setRoot(AddcardPage);
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }


  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
}


ionViewDidEnter() {
  this.getCustWalletSevice(HomePage.dataFromEmail,HomePage.dataFromPassword);

  this.initializeBackButtonCustomHandler();
}
public initializeBackButtonCustomHandler(): void {
  this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
      this.customHandleBackButton();
  }, 10);
}
private customHandleBackButton(): void {

  // this.navCtrl.setRoot(TabsPage);
  this.navCtrl.getByIndex(0)
  this.navCtrl.parent.select(0);

}
openHome(){
  this.navCtrl.getByIndex(0);
  this.navCtrl.parent.select(0);
}

removezero(item) {
  let itemToConvert =  item.aAmount.toString();
  let newValue = itemToConvert.split('.')[0];
  return newValue;
  }


  }


