import { MyApp } from './../../app/app.component';
import { SendtofriendPage } from './../sendtofriend/sendtofriend';
import { HomePage } from './../home/home';
import { AlertController } from 'ionic-angular';
import { GeneralService } from './../../providers/general-service/GeneralService';
import { LoadingController } from 'ionic-angular';
import { timeout } from 'rxjs/operator/timeout';
import { PayPage } from './../pay/pay';
import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';


/**
 * Generated class for the MaintwoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-maintwo',
  templateUrl: 'maintwo.html',
})
export class MaintwoPage {
  dataFromBuyCardConfirmPage: any;

  paymentUrl: any;
  paymentUrl2: any;
  paymentUrl3: any;
  finishingOrderText: any;
  dataList:any = [];
  dataListFromFinishOrder:any = [];
  data: any = [];
  dataListFromGetAddress: any;
  tabBarElement: any;


  constructor(public generalService: GeneralService,public navCtrl: NavController, public navParams: NavParams,public sanitizer:DomSanitizer,public loader:LoadingController,public alertCtrl: AlertController) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

    this.showLoader();
    this.dataFromBuyCardConfirmPage = navParams.get("item");






  }
  showLoader(){
    let loader = this.loader.create({
      content: MyApp.loadingText
    });

    loader.present();


    this.paymentUrl=PayPage.paymentUrl;
    this.paymentUrl2 = this.sanitizer.bypassSecurityTrustResourceUrl(this.paymentUrl);
    this.paymentUrl3 = this.paymentUrl2.changingThisBreaksApplicationSecurity;
    setTimeout( () => {
      loader.dismiss();

    }, 5000);

  }

  payment_verification() {
    let loader = this.loader.create({
      content:  MyApp.verifyText
    });

    loader.present();
    let body = 'merchant_email=kazmi58@gmail.com'+
    '&secret_key=6S0Qpby7suLCZMTj1TVdAlWA4isg8y1fr15QdDYF8Kh7wbrx4nLFIIgM0J39h4oJ5uzj8yYgifoPqQmvd8bWQrJRaM0sRpbXTLg2'+
    '&payment_reference=' +PayPage.p_id;
    body = encodeURIComponent(body);
    //WEBSERVICE
    this.generalService.payService(body,"https://www.paytabs.com/apiv2/verify_payment").then(response => {
        console.log(response);
        this.dataList = response;
        this.dataList = this.dataList._body;
        this.dataList = JSON.parse(this.dataList);
        // CONDITIONS
        //To check for the response message from VerfifyingPayment Reqeust
        if(this.dataList.response_code=="0"){
          let alert = this.alertCtrl.create({
            title:this.dataList.result,
            buttons:['OK']
          });
          alert.present();
          loader.dismiss();
          this.navCtrl.pop();


        }
        else if(this.dataList.response_code=="100"){ //for success condition
          loader.dismiss();

          let alert = this.alertCtrl.create({
            title:this.dataList.result,
            buttons:[MyApp.okayText]
          });
          this.finishOrderService(HomePage.dataFromEmail,HomePage.dataFromPassword,PayPage.paymentAddressId);



        }
        else if(this.dataList.response_code=="481" || this.dataList.response_code=="482"){
          let alert = this.alertCtrl.create({
            title:this.dataList.result,
            buttons:[MyApp.okayText]
          });
          alert.present();
          loader.dismiss();
          this.navCtrl.pop();
        }
        else {
          let alert = this.alertCtrl.create({
            title:this.dataList.result,
            buttons:[MyApp.okayText]
          });
          alert.present();
          loader.dismiss();
          this.navCtrl.pop();


        }
    },
    error => {
      loader.dismiss();

      console.log(error);
      alert(MyApp.errorText);
    });

  }


  finishOrderService(email,password,paId){
     let method = "FinishOrder";
     let request = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"> <Body> <FinishOrder xmlns="http://tempuri.org/"> <paymentMethodName>Payments.Manual</paymentMethodName> <shippingoption></shippingoption> <billingAddressId>'+paId+'</billingAddressId> <shippingAddressId>'+paId+'</shippingAddressId> <pickUpInStore>1</pickUpInStore> <pickupPointValue></pickupPointValue> <usernameOrEmail>'+email+'</usernameOrEmail> <userPassword>'+password+'</userPassword> <creditCardType>Master card</creditCardType> <creditCardName>'+HomePage.dataFromFirstName+' '+HomePage.dataFromLastName+'</creditCardName> <creditCardNumber>0000000000000000</creditCardNumber> <creditCardExpireMonth>2</creditCardExpireMonth> <creditCardExpireYear>2019</creditCardExpireYear> <creditCardCvv2>000</creditCardCvv2><ocassionImageURL>'+this.dataFromBuyCardConfirmPage.GiftCardImageUrl+'</ocassionImageURL> </FinishOrder> </Body> </Envelope>';

    let loader = this.loader.create({
      content: MyApp.loadingText
    });
    loader.present();
    this.generalService.webService(request,method).then(
      response => {
        loader.dismissAll();
        this.dataListFromFinishOrder = response;
        this.data = this.dataListFromFinishOrder;
        console.log("From finishOrderService",response);

        if (this.dataListFromFinishOrder.statusText == "OK") {

          console.log("ORDER FINISHED");
          console.log("getAddressService ",this.dataListFromFinishOrder);

          this.dataListFromFinishOrder = JSON.parse(this.dataListFromFinishOrder._body);

          console.log("getAddressService with address",this.dataListFromGetAddress);
          setTimeout(() => {
            this.openSendToFriendPage(this.dataFromBuyCardConfirmPage);
          }, 300)

        }
        else if (this.dataListFromFinishOrder.statusText == "Error") {

          console.log("DATA HAS NOT BEEN FETCHED");
          console.log("getAddressService ",this.dataListFromFinishOrder);
          this.dataListFromFinishOrder = JSON.parse(this.dataListFromFinishOrder._body);

          console.log("getAddressService with address",this.dataListFromFinishOrder);
          loader.dismiss();

          let alert = this.alertCtrl.create({
            title:this.dataListFromFinishOrder.aMessage,
            buttons:[MyApp.okayText]
          });
          alert.present();
          // this.navCtrl.pop(); // TOgo back to previous page  if error repsonse comes

        }

        else {

               let alert = this.alertCtrl.create({
            title:this.dataListFromFinishOrder.aMessage,
            buttons:[MyApp.okayText]
          });
            loader.dismiss();
        }
      },
      error => {

        console.log(error);
        alert( MyApp.errorText);
        loader.dismiss();

      }
    );


  }

  openSendToFriendPage(value){

    this.navCtrl.setRoot(SendtofriendPage, {
      item: this.dataFromBuyCardConfirmPage
    });
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad MaintwoPage');
  }
  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';

  }
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

}
