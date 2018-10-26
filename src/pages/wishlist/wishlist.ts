import { GeneralService } from './../../providers/general-service/GeneralService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { SelectedcardPage } from '../selectedcard/selectedcard';
import { MyApp } from '../../app/app.component';

@Component({
  selector: 'page-wishlist',
  templateUrl: 'wishlist.html',
})
export class WishlistPage {
  dataList: any = [];
  data: any = [];
  aName: any;
  value: any;
  wishlistResponse: any =[];
  username: any;
  password: any;




  constructor(
    public translate: TranslateService,
    public loadingCtrl: LoadingController,
    public generalService: GeneralService,
    public navCtrl: NavController,
    private storage:Storage,
    public navParams: NavParams) {


      this.value = navParams.get('item');
      // ProductPage.categoryId = this.value.aId;


       //Constructer Starting
       this.storage.keys().then((res) => {
         console.log(res);
       });
       // Opening a Loader for Loding data
       let loader = this.loadingCtrl.create({
           content: MyApp.loadingDataText
       });
       console.log("USERANME IS",this.username);
       console.log("password IS",this.password);


     loader.present();
     this.storage.get('usr').then((usr) => {
         this.storage.get('pwd').then((pwd) => {
             this.getWishList(usr,pwd,loader);
             this.username=usr;
             this.password=pwd;
             console.log("USERANME IS",this.username);
             console.log("password IS",this.password);

         });
       });
  }


  private getWishList(username,password,loader) {
    let requestCategory = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/"> <soapenv:Header/> <soapenv:Body> <tem:GetWishlist> <tem:usernameOrEmail>'+username+'</tem:usernameOrEmail> <tem:userPassword>'+password+'</tem:userPassword> </tem:GetWishlist> </soapenv:Body> </soapenv:Envelope>';
    let methodCategory = 'GetWishlist';
    this.generalService.webService(requestCategory,methodCategory).then(response => {

      this.dataList = response;
      console.log( "RESPONSE IS",response)
      this.dataList = JSON.parse(this.dataList._body);
      console.log("RESPONSE WITH JSON is",this.dataList)
      this.wishlistResponse= this.dataList.aWishlist;
      console.log("WISHLIST RESPONSE  is",this.wishlistResponse)
      loader.dismiss();

      if (this.dataList.aWishlist) {
        if (this.dataList.aWishlist.length > 0) {
          this.data = this.dataList.aWishlist;

          // //For Manually inserting aName on the Title Bar
          // // otherwise it was duplicating

          // this.aName= this.value.aName;

        } else {
          this.data['0'] = this.dataList.aWishlist;

          // this.aName= this.value.aName;
        }
      } else {
        this.data = null;
      }
    }, error =>{
        loader.dismiss();
        alert( MyApp.errorText);
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad WishlistPage');
  }
  public openSelectedPage(event, item,pId:number){
    this.navCtrl.push('SelectedcardPage',{
      productData: item,
      pId:pId

  });
  debugger;
  }
}
