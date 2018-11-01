import { TranslateService } from '@ngx-translate/core';
import { MyApp } from './../../app/app.component';
import { MaintwoPage } from './../maintwo/maintwo';
import { GeneralService } from './../../providers/general-service/GeneralService';
import { SendtofriendPage } from './../sendtofriend/sendtofriend';
import { BuycardconfirmPage } from './../buycardconfirm/buycardconfirm';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform,AlertController,LoadingController } from 'ionic-angular';
import { InAppBrowser,InAppBrowserOptions  } from '@ionic-native/in-app-browser';
import { AccountsPage } from '../accounts/accounts';
import { Storage } from "@ionic/storage";
import { NetworkInterface } from '@ionic-native/network-interface';
import { empty } from '../../../node_modules/rxjs/Observer';
import { HomePage } from '../home/home';
import {ThemeableBrowser, ThemeableBrowserOptions,ThemeableBrowserButton, ThemeableBrowserObject} from '@ionic-native/themeable-browser'
import { PaytabProvider } from './../../providers/paytab/paytab';

/**
 * Generated class for the PayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-pay',
  templateUrl: 'pay.html',
})
export class PayPage {

  noAddressText:string = "No address on your Profile. please type it manually";
  requestName: any = "merchant_email"
  requestMethod: any = "secret_key";
  secretKey ="6S0Qpby7suLCZMTj1TVdAlWA4isg8y1fr15QdDYF8Kh7wbrx4nLFIIgM0J39h4oJ5uzj8yYgifoPqQmvd8bWQrJRaM0sRpbXTLg2";
    urlforWeview:any;
  url: "https://www.paytabs.com/apiv2/create_pay_page";
  email: any;
  password: any;
  firstName: any;
  lastname:any;
  firstname:any;
  username: any;
  method: string = "";
  request: string = "";
  dataList: any = "";
  dataListFromGetAddress: any = "";
  aEmail:any="";
  data: any = [];
  usr:any= [];
  pwd:any;
  user: string;
  ProductData: any = [];
  ipAddress: (address: any) => void;
  dataListFromFinishOrder:any= [];
  static paymentUrl :any;
  aAddress: any= "";
  dataFromBuyCardConfirmPage: any= [];
  value:any;
  aAddresses: any= "";
  fillAddressText:any="Please fill in your address to continue..";
  status: any;
  addressFromForm:any= "";
  state:any= "";
  country:any= "";
  city:any= "";
  ZipPostalCode:any= "";
  phonenumber:any= "";
  datafromAddNewAddress: any = [];
  emptyFieldText: any="please fill all the fields...";
  static paymentAddressId: any = 0;
  useAddNewService: boolean = false;
  dataAddAddressList :any = [];
  isEmpty: boolean = false;
  static p_id:any;
  currentLang: string;
  responseFromPayTabPlugin: any;
  response_code: any;
  responseCode: any;
  transactionId: any;
  result: any;
  splitCodes: any;

  constructor(public paytab:PaytabProvider,public translate:TranslateService,private themeableBrowser:ThemeableBrowser,private networkInterface: NetworkInterface,public generalService: GeneralService,private storage: Storage,public loader:LoadingController,public alertCtrl:AlertController,public navCtrl: NavController,public platform: Platform, public navParams: NavParams,private iab: InAppBrowser) {


    if(this.translate.store.currentLang==='ar'){
      this.currentLang = "Arabic"
    }
    else{
      this.currentLang = "English"

    }

    this.dataFromBuyCardConfirmPage = navParams.get("item");
    console.log("dataFromBuyCardConfirmPage",this.dataFromBuyCardConfirmPage);

    this.setAddressData();

    this.networkInterface.getWiFiIPAddress()
    .then( this.ipAddress=address=> console.info(`IP: ${address.ip}, Subnet: ${address.subnet}`))
    .catch(error => console.error(`Unable to get IP: ${error}`));

  this.ProductData= this.navParams.get("item");
  console.log(this.ProductData);
    //getting USER Info from getCustomerInfo Service
    this.storage.ready().then(() => {

    this.storage.get('usr').then((usr) => {
      this.username= usr;
    });

    this.storage.get('pwd').then((pwd) => {
        this.password = pwd;

    });

  });
}


  private setAddressData () {
    this.firstname = HomePage.dataFromFirstName;
    this.lastname = HomePage.dataFromLastName;
    this.phonenumber= HomePage.dataFromPhoneNumber;
    this.email= HomePage.dataFromEmail;

    if (HomePage.AddressId &&  HomePage.AddressId != 0 ) {
      PayPage.paymentAddressId=HomePage.AddressId;
      this.addressFromForm=HomePage.Address;
      this.country="Saudi Arabia";
      this.city="Riyadh";
      this.state= "Riyadh";
      this.ZipPostalCode= "11543";
    } else {
      this.country="Saudi Arabia";
      this.city="Riyadh";
      this.state= "Riyadh";
      this.ZipPostalCode= "11543";
      this.useAddNewService = true;
    }

  }

  openSendToFriendPage(value){

    this.navCtrl.setRoot(SendtofriendPage, {
      item: this.dataFromBuyCardConfirmPage
    });
  }

  //If address is available then dont call the AddNewAddress API
  toCheckDataInsideAddress(){
    var reg = new RegExp(/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/);
    if(this.firstname=="" || this.lastname=="" ||this.email=="" || this.addressFromForm==""){

      let alert = this.alertCtrl.create({
        title:this.emptyFieldText,
        buttons:[MyApp.okayText]
      });
      alert.present();
    }
    else if(reg.test(this.phonenumber)==false){
      let alert = this.alertCtrl.create({
        title:MyApp.invalidPhone,
        buttons:[MyApp.okayText]
      });
      alert.present();
    }
    else{
    //if the address1 object is {""} means empty
    if(this.useAddNewService == true){

      this.AddNewAddress(this.addressFromForm,this.city,this.firstname,this.lastname,this.ZipPostalCode,this.phonenumber,this.email,this.password);
    }
    else
    {
      let loader = this.loader.create({
              content: MyApp.loadingDataText
            });
          loader.present();

      this.openPayPageApi(loader);
    }

  }



  }



  openPayPageApi(loader){

    let body = 'merchant_email=zaki_us94@hotmail.com'+
    '&secret_key=KbAfc2tncaeJoTIWY8hy7iGg7NEGzBLkMlzYo2mBdAkCu2ysbQ1i8HzfudW4PIoC4YAs1X4eyoR2rquDgwVpdvEIJBNyjcanaLQb'+
    '&site_url=' +'https://bahjahcards.com'+
    '&return_url=' + 'https://bahjahcards.com/successPaytabs/'+
    '&title=' + this.ProductData.aName+
    '&cc_first_name=' + this.firstname+//
    '&cc_last_name=' + this.lastname+//
    '&cc_phone_number=' + '00966'+//
    '&phone_number=' + this.phonenumber+//
    '&email=' + this.email+//
    '&products_per_title=' + this.ProductData.aName+
    '&unit_price=' + this.ProductData.FinalPrice+
    '&quantity=' + '1'+
    '&other_charges=' + '00.00'+
    '&amount=' + this.ProductData.FinalPrice+
    '&discount=' + '00.00'+
    '&currency=' + 'SAR'+
    '&reference_no=' + this.ProductData.aSku+
    '&ip_customer=' +this.ipAddress+
    '&ip_merchant=' + '11.11.22.22'+
    '&billing_address=' +this.addressFromForm+//
    '&state=' + this.state+//
    '&city=' + this.city+//
    '&postal_code=' + this.ZipPostalCode+//
    '&country=' + 'SAU'+//
    '&shipping_first_name=' + this.firstname+
    '&shipping_last_name=' + this.lastname+
    '&address_shipping=' + this.addressFromForm+
    '&city_shipping=' + this.city+
    '&state_shipping=' + this.state +
    '&postal_code_shipping=' + this.ZipPostalCode+
    '&country_shipping=' + 'SAU'+
    '&msg_lang=' + this.currentLang+
    '&cms_with_version=' + ' Nop Commerce ';

    //data for sending to paytab plugin
    let data = {
      merchantEmail:'zaki_us94@hotmail.com',
      secretKey:'KbAfc2tncaeJoTIWY8hy7iGg7NEGzBLkMlzYo2mBdAkCu2ysbQ1i8HzfudW4PIoC4YAs1X4eyoR2rquDgwVpdvEIJBNyjcanaLQb',
      transactionTitle:this.username,
      amount:this.ProductData.FinalPrice,
      customer_email:this.email,
      customer_phone_number:this.phonenumber,
      order_id:this.ProductData.aSku,
      product_name:this.ProductData.aName,
      address_billing:this.addressFromForm ,
      city_billing:this.city,
      state_billing:this.state,
      country_billing:'SAU',
      postal_code_billing:this.ZipPostalCode,
      address_shipping:this.addressFromForm,
      city_shipping:this.city ,
      state_shipping: this.state,
      country_shipping:this.country ,
      postal_code_shipping:this.ZipPostalCode,
      language: this.currentLang,
    }
    loader.dismiss();
    this.paytab.add(data)

    .then(result =>
    {

      this.responseFromPayTabPlugin = result;
      // console.log(this.responseFromPayTabPlugin)
      // this.splitCodes = this.responseFromPayTabPlugin.split(/, |"/)


      // this.responseCode = this.splitCodes[7];


      // this.transactionId = this.splitCodes[3];

      this.responseCode = this.responseFromPayTabPlugin.response_code;
      this.transactionId = this.responseFromPayTabPlugin.transaction_id;


      console.log("Transaction Id is",this.transactionId);
      console.log("Response Code is",this.responseCode);


      if(this.responseCode=="100"){
        this.finishOrderService(this.username,this.password,PayPage.paymentAddressId);

      }
      else{
        console.log('else'+this.responseCode);

      }


    }).catch(err =>{




      loader.dismiss();

      console.log(" error result is" , err)


        let alert = this.alertCtrl.create({
          title:MyApp.errorText,
          buttons:[MyApp.okayText]
        });
        alert.present();



    })













// body = encodeURIComponent(body);
// this.generalService.payService(body,"https://www.paytabs.com/apiv2/create_pay_page").then(response => {
//   console.log(response);
//   this.dataList = response;
//   this.dataList = this.dataList._body;
//   this.dataList = JSON.parse(this.dataList);
//   PayPage.p_id = this.dataList.p_id;


//       loader.dismiss();
//     PayPage.paymentUrl=this.dataList.payment_url;
//     console.log("PAY MENT URL IS" , PayPage.paymentUrl )


//   // const options:ThemeableBrowserOptions = {

//   //   toolbar: {
//   //     height:55  ,
//   //     color: '#4d1cceff'
//   //   },
//   //   title: {
//   //     color: '#ffffffff',
//   //     showPageTitle: true,
//   //     staticText: 'Pay'
//   //   },

//   //   backButton: {
//   //     wwwImage: 'assets/imgs/backbuttonwhite.png',
//   //     align: 'left',
//   //     wwwImageDensity: 11,

//   //   },

//   //   closeButton: {
//   //     wwwImage: 'assets/imgs/donebutton.png',
//   //     align: 'right',
//   //     event: 'done',
//   //     wwwImageDensity: 11,


//   //   },


//   // }
//   // this.platform.ready().then(() => {

//   //   const browser:ThemeableBrowserObject = this.themeableBrowser.create(this.dataList.payment_url,'_blank',options);

//   //   browser.on('done').subscribe(()=>{
//   //     // Loader for verifying Request
//   //     let loader = this.loader.create({
//   //       content: "Verifying Payment..."
//   //     });
//   //     this.payment_verification(this.dataList.p_id,loader);

//   //   });
//   //   }
//   // )
//   this.navCtrl.push(MaintwoPage, {
//     item: this.dataFromBuyCardConfirmPage
//   });


// },
// error => {
//   console.log(error);
//   alert( MyApp.errorText);

// });




}

  payment_verification(id,loader) {
    let body = 'merchant_email=zaki_us94@hotmail.com'+
    'KbAfc2tncaeJoTIWY8hy7iGg7NEGzBLkMlzYo2mBdAkCu2ysbQ1i8HzfudW4PIoC4YAs1X4eyoR2rquDgwVpdvEIJBNyjcanaLQb'+
    '&payment_reference=' +id;
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


        }
        else if(this.dataList.response_code=="100"){ //for success condition
          loader.dismiss();

          let alert = this.alertCtrl.create({
            title:this.dataList.result,
            buttons:['OK']
          });



        }
        // else if(this.dataList.response_code=="481" || this.dataList.response_code=="482"){
        //   let alert = this.alertCtrl.create({
        //     title:this.dataList.result,
        //     buttons:['OK']
        //   });
        //   alert.present();
        //   loader.dismiss();
        // }
        // else {
        //   let alert = this.alertCtrl.create({
        //     title:this.dataList.result,
        //     buttons:['OK']
        //   });
        //   alert.present();
        //   loader.dismiss();

        // }
    },
    error => {
      loader.dismiss();

      console.log(error);
      alert( MyApp.errorText);
    });

  }


  finishOrderService(email,password,paId){
    this.method = "FinishOrder";
    this.request = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"> <Body> <FinishOrder xmlns="http://tempuri.org/"> <paymentMethodName>Payments.Manual</paymentMethodName> <shippingoption></shippingoption> <billingAddressId>'+paId+'</billingAddressId> <shippingAddressId>'+paId+'</shippingAddressId> <pickUpInStore>1</pickUpInStore> <pickupPointValue></pickupPointValue> <usernameOrEmail>'+email+'</usernameOrEmail> <userPassword>'+password+'</userPassword> <creditCardType>Master card</creditCardType> <creditCardName>'+this.firstname+' '+this.lastname+'</creditCardName> <creditCardNumber>0000000000000000</creditCardNumber> <creditCardExpireMonth>2</creditCardExpireMonth> <creditCardExpireYear>2019</creditCardExpireYear> <creditCardCvv2>000</creditCardCvv2> </FinishOrder> </Body> </Envelope>';

    let loader = this.loader.create({
      content: MyApp.finishingOrderText
    });
    loader.present();
    this.generalService.webService(this.request, this.method).then(
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
            buttons:['OK']
          });
          alert.present();
          // this.navCtrl.pop(); // TOgo back to previous page  if error repsonse comes

        }

        else {

               let alert = this.alertCtrl.create({
            title:this.dataListFromFinishOrder.aMessage,
            buttons:['OK']
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



  AddNewAddress(address1,city,firstname,lastname,ZipPostalCode,phonenumber,email,password){

    let loader = this.loader.create({
      content: MyApp.loadingDataText
    });
    loader.present();

    this.method = "AddNewAddress";
    this.request = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"> <Body> <AddNewAddress xmlns="http://tempuri.org/"> <address1>'+address1+'</address1> <address2></address2> <city>'+city+'</city> <company>Customer</company> <countryId>69</countryId> <email>'+email+'</email> <firstName>'+firstname+'</firstName> <lastName>'+lastname+'</lastName> <stateProvinceId>0</stateProvinceId> <zipPostalCode>'+ZipPostalCode+'</zipPostalCode> <phoneNumber>'+phonenumber+'</phoneNumber> <faxNumber></faxNumber> <usernameOrEmail>'+email+'</usernameOrEmail> <userPassword>'+password+'</userPassword> <!-- Optional --> <inputValues> <!-- Optional --> <KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays"> <Key>address_attribute_1</Key> <Value>2</Value> </KeyValueOfstringstring> <KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays"> <Key>address_attribute_2</Key> <Value>21.4858</Value> </KeyValueOfstringstring> <KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays"> <Key>address_attribute_3</Key> <Value>39.1925</Value> </KeyValueOfstringstring> </inputValues> </AddNewAddress> </Body> </Envelope>';



    this.generalService.webService(this.request, this.method).then(
      response => {

        this.useAddNewService = false;

        this.data = response;
        this.dataAddAddressList = JSON.parse(this.data._body);
        loader.dismiss();

        if(this.dataAddAddressList.aStatus == "Success")
          PayPage.paymentAddressId = this.dataAddAddressList.aId;

        this.openPayPageApi(loader);
      },
      error => {
        loader.dismiss();
        console.log(error);
        alert( MyApp.errorText);
      }
    );

  }

  changeToggle(){
    if(this.isEmpty==false){

      this.addressFromForm=HomePage.Address;
      this.country=HomePage.CountryName;
      this.city=HomePage.City;
      this.state= HomePage.StateProvinceName;
      this.ZipPostalCode= HomePage.ZipCode;

    }
    else{

      this.addressFromForm= "";
      this.country= "";
      this.city= "";
      this.state=  "";
      this.ZipPostalCode=  "";

    }
  }



}
