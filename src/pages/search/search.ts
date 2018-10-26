import { AlertController, Platform } from 'ionic-angular';
import { TabsPage } from './../tabs/tabs';
import { GeneralService } from './../../providers/general-service/GeneralService';
import { TranslateService } from '@ngx-translate/core';
import { NativePageTransitions,NativeTransitionOptions } from '@ionic-native/native-page-transitions';

import { SearchtwoPage } from './../searchtwo/searchtwo';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, PopoverController, ModalController, Tabs } from 'ionic-angular';
import { SelectedcardPage } from './../selectedcard/selectedcard';
import { Storage } from '@ionic/storage';
import { ProductPage } from '../product/product';
import { MyApp } from '../../app/app.component';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  method : string = "";
  request : string = "";
  dataList : any = "";
  img: any;
  dataArray = [];
  data: any = [];
  dataResponse: any;
  ev:any;
  tabIndex: number;
  unregisterBackButtonAction: any;


  constructor(public nativePageTransitions:NativePageTransitions,public toastCtrl: ToastController,public translate: TranslateService,public loadingCtrl: LoadingController,public generalService: GeneralService,public popoverCtrl: PopoverController, public navCtrl: NavController,public modalCtrl : ModalController, private storage: Storage,public alertCtrl:AlertController,public platform:Platform) {


    this.storage.get('usr').then((usr) => {
      this.storage.get('pwd').then((pwd) => {
          this.GetSearchCategories(usr,pwd);
      });
    });

        //overrding the back button to show the first tab



  }

  private GetSearchCategories(username,password) {
    let loader = this.loadingCtrl.create({
      content: MyApp.loadingDataText
    });
    loader.present();
    let requestCategory = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/"> <soapenv:Header/> <soapenv:Body> <tem:GetTopMenuCategories> <!--Optional:--> <tem:usernameOrEmail>'+username+'</tem:usernameOrEmail> <!--Optional:--> <tem:userPassword>'+password+'</tem:userPassword> <!--Optional:--> <tem:rootCategoryId>16</tem:rootCategoryId> </tem:GetTopMenuCategories> </soapenv:Body> </soapenv:Envelope>';
    let methodCategory = 'GetTopMenuCategories';
    this.generalService.webService(requestCategory,methodCategory).then(response => {
      this.dataResponse = response;
      this.dataResponse = JSON.parse(this.dataResponse._body);




       if (this.dataResponse.aWebServiceCategory) {
          if (this.dataResponse.aWebServiceCategory.length > 0) {
            this.data = this.dataResponse.aWebServiceCategory;
            this.dataArray = this.dataResponse.aWebServiceCategory;
          } else {
            this.data['0'] = this.dataResponse.aWebServiceCategory;
            this.dataArray = this.dataResponse.aWebServiceCategory;
          }
        } else {
          this.data = null;
          this.dataArray = null;
        }


      loader.dismiss();
    }, error => {
        loader.dismiss();
        return false;
    });
  }

  public openSearchtwo(){

    this.navCtrl.push(SearchtwoPage);

  }
  public openCardSelected(){
    this.navCtrl.push(SelectedcardPage);
  }

  public openProdWithCategory(event ,items){
    // let options: NativeTransitionOptions = {
    //   direction: 'left',
    //   duration: 400,
    //   slowdownfactor: -1,
    //   iosdelay: 50,
    //   androiddelay:50,


    //  };
    //  this.nativePageTransitions.slide(options);
    this.navCtrl.push(ProductPage,{item:items});
  }

  public getItems(ev) {
    // Reset items back to all of the items


    // set val to the value of the searchbar
    const val = ev.target.value;
    console.log(val);

    // // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.data = this.dataArray;
      this.data = this.data.filter((item) => {
            return (item.aName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    } else {
      this.data = this.dataArray;
    }
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

    // this.navCtrl.setRoot(TabsPage);
    this.navCtrl.getByIndex(0)
    this.navCtrl.parent.select(0);

  }







  }




