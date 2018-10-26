import { MyApp } from './../../app/app.component';
import { SelectedcardPage } from './../selectedcard/selectedcard';
import { AddcardsuccessPage } from './../addcardsuccess/addcardsuccess';
import { WalletPage } from './../wallet/wallet';
import { LoginPage } from './../login/login';
import { GeneralService } from './../../providers/general-service/GeneralService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';

/**
 * Generated class for the AddcardserialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage({
  segment: 'addCard'

})
@Component({
  selector: 'page-addcardserial',
  templateUrl: 'addcardserial.html',
})
export class AddcardserialPage {
  couponCode: string= "";
  password: string= "";
  username: string= "";
  user: any;
  category: any= [];
  aWebServiceAddWallet: any;
  statusText: string;

  constructor(public alertCtrl:AlertController,private storage:Storage,public navCtrl: NavController, public navParams: NavParams,public loadingCtrl:LoadingController,public generalService:GeneralService) {
    this.couponCode=this.navParams.get('couponCode');




  this.storage.get("usr").then((usr) => {
    this.user= usr;
  });

  this.storage.get('pwd').then((pwd) => {
      this.password = pwd;
  });

  setTimeout( () => {
    if (this.user != "" && this.user != null && this.password != "" && this.password != null  ) {

    } else {
      this.navCtrl.setRoot(LoginPage);

    }
  }, 2000);

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad AddcardserialPage');
  }
  AddToWalletByCouponCodeButton(){
    this.username = HomePage.dataFromEmail;

    if(this.couponCode==""){

      let alert = this.alertCtrl.create({
        title:MyApp.fieldEmptyText,
        buttons:['OK']
      });
      alert.present();
    }
    else {
      this.AddToWalletByCouponCodeService(this.username,this.password,this.couponCode);

    }

  }

  AddToWalletByCouponCodeService(username,password,couponCode){

    let loader = this.loadingCtrl.create({
      content: MyApp.verifyText
  });
  loader.present();

    let requestCategory = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"> <Body> <AddToWalletByCouponCode xmlns="http://tempuri.org/"> <usernameOrEmail>'+username+'</usernameOrEmail> <userPassword>'+password+'</userPassword> <coupon>'+couponCode+'</coupon> </AddToWalletByCouponCode> </Body> </Envelope>';
    let methodCategory = 'AddToWalletByCouponCode';

    this.generalService.webService(requestCategory,methodCategory).then(response => {

      this.category = response;

      this.statusText = this.category.statusText;
      console.log(this.statusText);

      if(this.statusText=="OK"){

      this.category = JSON.parse(this.category._body);
      console.log(this.category);

      this.aWebServiceAddWallet = this.category.aWebServiceAddWallet;


      //   let alert = this.alertCtrl.create({
      //   title:this.aWebServiceAddWallet.aProduct.aProducts.aName+" activated",
      //   buttons:['OK']
      // });
      // alert.present();

      this.navCtrl.push(AddcardsuccessPage, {
        item: this.aWebServiceAddWallet
      });



      // this.navCtrl.push(AddcardsuccessPage);

      console.log(this.aWebServiceAddWallet);
      loader.dismiss();}
      else {

      }

    }, error => {

        loader.dismiss();
        let alert = this.alertCtrl.create({
          title:MyApp.cardNotVerifiedText,
          buttons:['OK']
        });
        alert.present();
        return false;
    });

  }







}
