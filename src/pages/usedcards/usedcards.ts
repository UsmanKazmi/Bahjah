import { HomePage } from './../home/home';
import { LoadingController } from 'ionic-angular';
import { GeneralService } from './../../providers/general-service/GeneralService';
import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { MyApp } from '../../app/app.component';

/**
 * Generated class for the UsedcardsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-usedcards',
  templateUrl: 'usedcards.html',
})
export class UsedcardsPage {
  dataFromEmail: any = [];
  dataFromPassword: any = [];
  method: string;
  request: string;
  dataListFromGetCustOrder:any = [];
  data: any = [];
  statusText: string = "";
  aWebServiceCustomerOrder: any =[];
  aName: any;
  aUrlPicture: any;
  aPrice: any;
  aProducts:any=[];
  aProduct:any=[];
  isGiftCardUsed:any=false;


  constructor(public navCtrl: NavController, public navParams: NavParams, public GeneralService:GeneralService,public loader:LoadingController) {
    this.dataFromEmail = HomePage.dataFromEmail;
    this.dataFromPassword = HomePage.dataFromPassword;
    this.getCustomerOrder(this.dataFromEmail,this.dataFromPassword);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsedcardsPage');
  }
  getCustomerOrder(username, password){

    let loader = this.loader.create({
      content: MyApp.loadingDataText
    });
    loader.present();

    this.method = "GetCustomerOrders";
    this.request = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"> <Body> <GetCustomerOrders xmlns="http://tempuri.org/"> <usernameOrEmail>'+username+'</usernameOrEmail> <userPassword>'+password+'</userPassword> </GetCustomerOrders> </Body> </Envelope>'


    this.GeneralService.webService(this.request, this.method).then(
      response => {
        this.dataListFromGetCustOrder = response;
        this.statusText = this.dataListFromGetCustOrder.statusText;

        if(this.statusText=="OK"){









        this.data = JSON.parse(this.dataListFromGetCustOrder._body);

        if (this.data.aWebServiceCustomerOrder) {
          if (this.data.aWebServiceCustomerOrder.length > 0) {
          this.aWebServiceCustomerOrder = this.data.aWebServiceCustomerOrder;
          } else {
          this.aWebServiceCustomerOrder['0'] = this.data.aWebServiceCustomerOrder;
          }
          } else {
          this.aWebServiceCustomerOrder = null;
          }

        // this.aWebServiceCustomerOrder= this.data.aWebServiceCustomerOrder;


        // this.aProduct=this.aWebServiceCustomerOrder.aProduct;
        // this.aUrlPicture= this.aWebServiceCustomerOrder.aProduct.aProducts.aUrlPicture;
        // this.aPrice=this.aWebServiceCustomerOrder.aProduct.aProducts.aPrice;
        console.log(response);
        console.log(this.data);
        loader.dismiss();
        }
       else {
        alert("error fetching data...");


        }
      },
      error => {
        console.log(error);
        alert( MyApp.errorText);
      }
    );



  }

removeZero(item) {
  let itemToConvert =  item.toString();
  let newValue = itemToConvert.split('.')[0];
  return newValue;
  }

  trimDate(item) {
    let itemToConvert =  item.toString();
    let newValue = itemToConvert.split('T')[0];
    return newValue;
    }


}
