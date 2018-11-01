import { NavParams } from 'ionic-angular';
import { MyApp } from './../../app/app.component';
import { AlertController, Platform } from 'ionic-angular';
//import { WorkstatusmodalPage } from './../workstatusmodal/workstatusmodal';
import { TutorialPage } from './../tutorial/tutorial';
import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { NavController,ModalController,PopoverController, LoadingController, ToastController  } from 'ionic-angular';
import { WorkstatusmodalPage } from '../workstatusmodal/workstatusmodal';
import { GridmodalPage } from '../gridmodal/gridmodal';
import { FiltermodalPage } from '../filtermodal/filtermodal';
import { SelectedcardPage } from './../selectedcard/selectedcard';
import { GeneralService } from '../../providers/general-service/GeneralService';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';
import { Storage } from '@ionic/storage';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions'
import { TabsPage } from '../tabs/tabs';
import { ProductPage } from '../product/product';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  dataList : any = [];
  img: any;
  data: any = [];
  addClassName: string = "";
  category: any = [];
  password:string = "";
  user:string = "";

  public alertShown:boolean = false;

   static dataFromFirstName: any = [];
   static dataFromLastName: any = [];
   static dataFromPhoneNumber: any;
   static dataFromEmail: any = [];
   static dataFromPassword: any = [];
   static dataFromCustId: any = [];

   static AddressId: any = 0;
   static Address: any = "";
   static City: any = "";
   static CountryId: any = 0;
   static CountryName: any = "";
  static StateProvinceId: any = 0;
  static ZipCode: any = "";
  static StateProvinceName : any = "";


   public hidelanguageButton=true;

   FirstName: any = "";
   LastName: any = "";
   PhoneNumber: any = "";
   Email: any = "";
   Password: any = "";
   custID: any = "";
  // loadingDataText:string


  aAddresses: any;
  noAddressText: any;
  unregisterBackButtonAction: any;
  dataFromFilters: any;


  constructor(
    private nativePageTransitions:NativePageTransitions,
    public toastCtrl: ToastController,
    public translate: TranslateService,
    public loadingCtrl: LoadingController,
    public generalService: GeneralService,
    public popoverCtrl: PopoverController,
    public navCtrl: NavController,
    public modalCtrl : ModalController,
    private storage:Storage,
    public alertCtrl:AlertController,
    public platform:Platform,
    public navparams:NavParams
  ) {
    this.dataFromFilters=this.navparams.get('dataFromFilters');


    console.log("THE PHONE NUMBER IN DATAFROMPHONENUMBER IS:",HomePage.dataFromPhoneNumber)
    // Opening a Loader for Loading data

    this.storage.get("usr").then((usr) => {
      this.user= usr;
    });

    this.storage.get('pwd').then((pwd) => {
        this.password = pwd;
        this.setLanugage(this.user,this.password);
    });
    setTimeout( () => {
      let loader = this.loadingCtrl.create({
        content: MyApp.loadingDataText
    });

    loader.present();

      if (this.user != "" && this.user != null && this.password != "" && this.password != null  ) {
        this.GetSideMenuCategories(this.user,this.password,loader);
        this.GetDashboard(this.user,this.password,loader);
        //  this.getProductsByFilter(this.user,this.password,'Best Selling',16);

      } else {
        loader.dismiss();
            let toast = this.toastCtrl.create({

              //assigning the success message to toast only
              message: MyApp.needToLoginFirstText,
              duration: 1500
            });
            toast.present(toast);


        this.navCtrl.setRoot(LoginPage);

      }
    }, 1000);



  }

  private GetSideMenuCategories (username,password,loader) {

    let requestCategory = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/"> <soapenv:Header/> <soapenv:Body> <tem:GetTopMenuCategories> <!--Optional:--> <tem:usernameOrEmail>'+username+'</tem:usernameOrEmail> <!--Optional:--> <tem:userPassword>'+password+'</tem:userPassword> <!--Optional:--> <tem:rootCategoryId>16</tem:rootCategoryId> </tem:GetTopMenuCategories> </soapenv:Body> </soapenv:Envelope>';
    let methodCategory = 'GetTopMenuCategories';
    this.generalService.webService(requestCategory,methodCategory).then(response => {
      this.category = response;
      this.category = JSON.parse(this.category._body);
    }, error => {
        loader.dismiss();
        return false;
    });

  }

  private GetDashboard (username,password,loader) {
      let methodHome = "GetDashboard";
      let requestHome ='<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"> <Body> <GetDashboard xmlns="http://tempuri.org/"> <usernameOrEmail>'+username+'</usernameOrEmail> <userPassword>'+password+'</userPassword> </GetDashboard> </Body> </Envelope>';

      this.generalService.webService(requestHome,methodHome).then(response => {

        this.dataList = response;

        this.dataList = JSON.parse(this.dataList._body);
        this.dataList = this.dataList.aDashboard;


        HomePage.dataFromFirstName = this.dataList.aFirstName
        this.FirstName = HomePage.dataFromFirstName;

         HomePage.dataFromLastName = this.dataList.aLastName;
         this.LastName = HomePage.dataFromLastName;

         HomePage.dataFromPhoneNumber = this.dataList.aPhone;
         this.PhoneNumber = HomePage.dataFromPhoneNumber;

         HomePage.dataFromEmail = this.dataList.aEmail;
         this.Email = HomePage.dataFromEmail;

         HomePage.dataFromCustId = this.dataList.aCustomerId;
         this.custID = HomePage.dataFromCustId;

         HomePage.dataFromPassword = this.password;
         this.password = HomePage.dataFromPassword;



         if ( this.ObjectIsEmpty(this.dataList.aAddresses) ) {
           console.log('Empty');
         } else {
          this.aAddresses = this.dataList.aAddresses;
          HomePage.AddressId = this.aAddresses.aAddress.aId;
          HomePage.Address = this.aAddresses.aAddress.aAddress1;
          HomePage.City = this.aAddresses.aAddress.aCity;
          HomePage.CountryId = this.aAddresses.aAddress.aCountryId;
          HomePage.CountryName = this.aAddresses.aAddress.aCountryName;
          HomePage.StateProvinceId = this.aAddresses.aAddress.aStateProvinceId;
          HomePage.StateProvinceName = this.aAddresses.aAddress.aStateProvinceId == 0 ? "Saudi Arabia" :  this.aAddresses.aAddress.aStateProvinceName;
          HomePage.ZipCode = this.aAddresses.aAddress.aZipPostalCode;

          this.PhoneNumber = HomePage.dataFromPhoneNumber;
         }

        this.dataList =  this.dataList.aProduct;
        loader.dismiss();
        if (this.dataList.aProducts) {
          if (this.dataList.aProducts.length > 0) {
            this.data = this.dataList.aProducts;
          } else {
            this.data['0'] = this.dataList.aProducts;
          }
        } else {
          this.data = null;
        }
      }, error =>{
          loader.dismiss();
          let alert = this.alertCtrl.create({
            title:MyApp.errorText,
            buttons:[MyApp.okayText]
          });
          alert.present();
        });
        console.log("TAB INDEX IS",TabsPage.tabIndex)


  }



  public getIDfromHomepage(event ,item,pId:number){

    // let options: NativeTransitionOptions = {
    //   direction: 'left',
    //   duration: 350,
    //   slowdownfactor: -1,
    //   iosdelay: 20,
    //   androiddelay:100,
    //   fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
    //   slidePixels: 0,
    //  };

    // this.nativePageTransitions.slide(options);
    this.navCtrl.push('SelectedcardPage',{
        productData:item,
        pId:pId
    });
  }

  openLogin(){
    this.navCtrl.push(LoginPage);
  }

  openTutorial(){

    this.navCtrl.push(TutorialPage);

  }
public openFiltermodal(){


    // if(this.translate.store.currentLang==='ar'){
    //   var modalPageAr = this.modalCtrl.create(FiltermodalPage,{categories: this.category, enableBackdropDismiss: true}, {cssClass: 'classmodalArab'} );
    //   modalPageAr.onDidDismiss(filterData => {
    //     if (filterData && filterData != null) {
    //         this.setFilterContent(filterData);
    //     }
    //   });
    //   modalPageAr.present();
    // }
    // else{
      var modalPageEn = this.modalCtrl.create(FiltermodalPage,{categories: this.category, enableBackdropDismiss: true}, {cssClass: 'classmodal classmodalEN'} );
      modalPageEn.onDidDismiss(filterData => {
        if (filterData && filterData != null) {
            this.setFilterContent(filterData);
        }
      });
      modalPageEn.present();
    // }

}

public setFilterContent(filterList) {
  if (filterList.aProducts) {
    if (filterList.aProducts.length > 0) {
      this.data = filterList.aProducts;
    } else {
      this.data['0'] = filterList.aProducts;
    }
  } else {
    this.data = null;
  }
}

public openGridmodal(){

  // if(this.translate.store.currentLang==='ar'){
  //   var modalPageAr = this.modalCtrl.create(GridmodalPage,{categories: this.category, enableBackdropDismiss: true}, {cssClass: 'classmodalArab'} );
  //   modalPageAr.onDidDismiss(items => {
  //     this.navCtrl.push(ProductPage,{item:items});
  //   });
  //   modalPageAr.present();
  // }
  // else{
    var modalPageEn = this.modalCtrl.create(GridmodalPage,{categories: this.category, enableBackdropDismiss: true}, {cssClass: 'classmodal classmodalEN'} );
    modalPageEn.onDidDismiss(items => {
      this.navCtrl.push(ProductPage,{item:items});
    });
    modalPageEn.present();
  // }

}
public openCardSelected(){

this.navCtrl.push(SelectedcardPage);

}

public ObjectIsEmpty(obj) {
  for(var key in obj) {
    if(obj.hasOwnProperty(key))
        return false;
}
  return true;
}
public openModal(){
var modalPage = this.modalCtrl.create(WorkstatusmodalPage); modalPage.present();
}



  presentPopover(myEvent) {
  let popover = this.popoverCtrl.create(GridmodalPage);
  popover.present({

  ev: myEvent

  });

  }

  presentConfirm() {
        let alert = this.alertCtrl.create({
          title: MyApp.alertExitTitle,
          message: MyApp.alertMessageText,
          buttons: [
            {
              text: MyApp.alertCancelText,
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
                this.alertShown=false;
              }
            },
            {
              text: MyApp.yesText,
              handler: () => {
                console.log('Yes clicked');
                this.platform.exitApp();
              }
            }
          ]
        });
         alert.present().then(()=>{
          this.alertShown=true;
        });

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

      if (this.alertShown==false) {
        this.presentConfirm();
      }
}

getProductsByFilter(filters){


  let methodHome = "GetProductByFilters";
      let requestHome ='<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"> <Body> <GetProductByFilters xmlns="http://tempuri.org/"> <filters>'+filters+'</filters> <categoryId>'+16+'</categoryId> <usernameOrEmail>'+HomePage.dataFromEmail+'</usernameOrEmail> <userPassword>'+HomePage.dataFromPassword+'</userPassword> </GetProductByFilters> </Body> </Envelope>';

      this.generalService.webService(requestHome,methodHome).then(response => {

        this.dataList = response;

        this.dataList = JSON.parse(this.dataList._body);
        //  this.dataList = this.dataList.aDashboard;
        console.log(this.dataList);




        // this.dataList =  this.dataList.aProduct;
        // // if (this.dataList.aProducts) {
        // //   loader.dismiss();
        // //   if (this.dataList.aProducts.length > 0) {
        // //     this.data = this.dataList.aProducts;
        // //   } else {
        // //     this.data['0'] = this.dataList.aProducts;
        // //   }
        // // } else {
        // //   this.data = null;
        // // }
      }, error =>{
          let alert = this.alertCtrl.create({
            title:MyApp.errorText,
            buttons:[MyApp.okayText]
          });
          alert.present();
        });





}


setLanugage(username,password) {
  let LangID = 2;
  if(this.translate.store.currentLang==='ar'){
    LangID = 2;
  } else {
    LangID = 1;
  }
  let LangMethod = "SetLanguage";
  let LangRequest = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"><Body><SetLanguage xmlns="http://tempuri.org/"> <usernameOrEmail>'+username+'</usernameOrEmail> <userPassword>'+password+'</userPassword> <langid>'+LangID+'</langid> </SetLanguage> </Body> </Envelope>';
  this.generalService.webService(LangRequest, LangMethod).then(
  resLang => {
    console.log(resLang);
  },
  resLangError => {
    console.log(resLangError);
  });

}


}



