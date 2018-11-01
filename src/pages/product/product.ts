import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

import { SelectedcardPage } from './../selectedcard/selectedcard';
import { GeneralService } from './../../providers/general-service/GeneralService';
import { LoadingController, PopoverController, ModalController, Platform } from 'ionic-angular';
import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { MyApp } from '../../app/app.component';

/**
 * Generated class for the ProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {


  dataList : any = "";
  data: any = [];
  value : any ;
  static categoryId: any;

  aName : any  =[];
  unregisterBackButtonAction: any;


  constructor(
    private nativePageTransitions:NativePageTransitions,
    public translate: TranslateService,
    public loadingCtrl: LoadingController,
    public generalService: GeneralService,
    public navCtrl: NavController,
    private storage:Storage,
    public navParams: NavParams,
    public platform:Platform
  ) {
    //for getting categoryID from previous page
     this.value = navParams.get('item');

     console.log("VALUE FROM GRID MODAL",this.value);


     ProductPage.categoryId = this.value.aId;

      // Opening a Loader for Loding data

    this.storage.get('usr').then((usr) => {
        this.storage.get('pwd').then((pwd) => {
            this.GetProductsBySelectedCategory(usr,pwd);

        });
      });


  }
  public openSelectedPage(event, item,pId:number){
    // let options: NativeTransitionOptions = {
    //   direction: 'left',
    //   duration: 400,
    //   slowdownfactor: -1,
    //   iosdelay: 50,
    //   androiddelay:50,


    //  };
    //  this.nativePageTransitions.slide(options);


    this.navCtrl.push('SelectedcardPage',{
      productData: item,
      pId:pId

    })


  }
  private GetProductsBySelectedCategory (username,password) {
    let loader = this.loadingCtrl.create({
      content: MyApp.loadingDataText

  });



loader.present();
    let requestCategory = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/"> <soapenv:Header/> <soapenv:Body> <tem:GetProductsBySelectedCategory> <tem:usernameOrEmail>'+username+'</tem:usernameOrEmail> <tem:userPassword>'+password+'</tem:userPassword> <tem:categoryId>'+ProductPage.categoryId+'</tem:categoryId> </tem:GetProductsBySelectedCategory> </soapenv:Body> </soapenv:Envelope>';
    let methodCategory = 'GetProductsBySelectedCategory';
    this.generalService.webService(requestCategory,methodCategory).then(response => {

      this.dataList = response;

      this.dataList = JSON.parse(this.dataList._body);

      if (this.dataList.aProducts) {

        if (this.dataList.aProducts.length > 0) {
          this.data = this.dataList.aProducts;

          //For Manually inserting aName on the Title Bar
          // otherwise it was duplicating

          this.aName= this.value.aName;
          loader.dismiss();
        } else {
          this.data['0'] = this.dataList.aProducts;
          this.aName= this.value.aName;
          loader.dismiss();

        }
      } else {
        this.data = null;
        loader.dismiss();

      }
    }, error =>{
        loader.dismiss();
        alert( MyApp.errorText);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductPage');
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
    this.navCtrl.pop();


  }

  openHome(){
  this.navCtrl.pop();

  }

}
