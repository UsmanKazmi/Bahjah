import { GeneralService } from './../../providers/general-service/GeneralService';
import { LoadingController, Platform } from 'ionic-angular';
import { NativePageTransitions,NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { PayPage } from './../pay/pay';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { BuycarddetailsPage } from '../buycarddetails/buycarddetails';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';
import { MyApp } from '../../app/app.component';



@Component({
  selector: 'page-buycardconfirm',
  templateUrl: 'buycardconfirm.html',
})
export class BuycardconfirmPage {
  wishListText: string = "Added to favourites"
  addToCartText: string = "Added to Cart"
  status: any;
  response: any;

  cards: string;
  value: any;
  value2: any;
  tabBarElement: any;
  amount: any = 1;
  dataList: any = "";
  img: any;
  data: any = [];
  product: any = [];
  attributeData: any = [];
  addClassName: string = "";
  category: any = [];
  aDefaultPictureModel: any;
  static productId: any;
  user: string = "";
  password: string = "";
  priceAttr: any;
  VendorModel: any = [];
  wishlistStatus: any = [];
  aImageUrl:any;
  reciepentName: any = [];
  reciepentgifttext: any = [];
  reciepentEmail: any = [];

  constructor( public platform:Platform,public navCtrl: NavController, public navParams: NavParams,public nativePageTransitions:NativePageTransitions,
    public toastCtrl: ToastController,
    public translate: TranslateService,
    public loadingCtrl: LoadingController,
    public generalService: GeneralService) {

    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.data = navParams.get("item");
    this.reciepentName = navParams.get("reciepentName")
    this.reciepentEmail = navParams.get("reciepentEmail")
    this.reciepentgifttext = navParams.get("reciepentgifttext")

    this.aDefaultPictureModel = this.data.aDefaultPictureModel;
    this.aImageUrl=this.aDefaultPictureModel.aImageUrl;


  }
  removeGiftText(){
    this.reciepentgifttext=""

  }



openPaymentScreen(){
  this.navCtrl.push(PayPage);
}
public openCardSelected(){
  //this.navCtrl.push(SelectedcardPage);
  this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length()-4));

}

 openGiftCardSelection(){
  //Bug
  this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length()-3));
}

 openCardDetail(){

 this.navCtrl.push(BuycarddetailsPage);

 }

 ionViewWillEnter() {
  this.tabBarElement.style.display = 'none';

    //To hide the Gift card Row when we havnt selected any Giftcard

  if(this.data.GiftCardImageUrl==undefined){
    document.getElementById("giftCard-Row").className = "hideThisId";
    }

}


addToCart(event, data) {


 // Opening a Loader for Loding data
 let loader = this.loadingCtrl.create({
  content: MyApp.loadingDataText
});

loader.present();

let CustomMessage = "Added to Cart! Thank You";

let dynamicAttributes = '';
let productQuantityAttr = '';


if (data.aProductAttributes["aWebServiceProductDetails.ProductAttributeModel"].length > 0) {
  for (let attributes of data.aProductAttributes["aWebServiceProductDetails.ProductAttributeModel"]) {
    if (attributes.aName == "Price") {
      dynamicAttributes = '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
        '<Key>product_attribute_' + attributes.aId + '</Key>' +
        '<Value>' + this.priceAttr + '</Value>' +
        '</KeyValueOfstringstring>';

      productQuantityAttr = '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
        '<Key>product_attribute_' + attributes.aId + '_' + this.priceAttr + '_qty</Key>' +
        '<Value>1</Value>' +
        '</KeyValueOfstringstring>';

    } else {
      dynamicAttributes += '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
        '<Key>product_attribute_' + attributes.aId + '</Key>' +
        '<Value>' + CustomMessage + '</Value>' +
        '</KeyValueOfstringstring>';
    }
  }
} else {
  let attributes = data.aProductAttributes["aWebServiceProductDetails.ProductAttributeModel"];
  if (attributes.aName == "Price") {
    dynamicAttributes = '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
      '<Key>product_attribute_' + attributes.aId + '</Key>' +
      '<Value>' + this.priceAttr + '</Value>' +
      '</KeyValueOfstringstring>';

    productQuantityAttr = '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
      '<Key>product_attribute_' + attributes.aId + '_' + this.priceAttr + '_qty</Key>' +
      '<Value>1</Value>' +
      '</KeyValueOfstringstring>';

  } else {
    dynamicAttributes += '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
      '<Key>product_attribute_' + attributes.aId + '</Key>' +
      '<Value>' + CustomMessage + '</Value>' +
      '</KeyValueOfstringstring>';
  }
}


let body = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"><Body><AddToCart xmlns="http://tempuri.org/"><productId>' + data.aId + '</productId><quantity>1</quantity><usernameOrEmail>' + this.user + '</usernameOrEmail><userPassword>' + this.password + '</userPassword><inputValues>';
body += dynamicAttributes;
body += '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
  '<Key>giftcard_' + data.aId + '.Message</Key>' +
  '<Value>' + CustomMessage + '</Value>' +
  '</KeyValueOfstringstring>' +
  '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
  '<Key>giftcard_' + data.aId + '.RecipientEmail</Key>' +
  '<Value>' + data.aGiftCard.aSenderEmail + '</Value>' +
  '</KeyValueOfstringstring>' +
  '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
  '<Key>giftcard_' + data.aId + '.RecipientName</Key>' +
  '<Value>' + data.aGiftCard.aSenderName + '</Value>' +
  '</KeyValueOfstringstring>' +
  '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
  '<Key>giftcard_' + data.aId + '.SenderEmail</Key>' +
  '<Value>' + data.aGiftCard.aSenderEmail + '</Value>' +
  '</KeyValueOfstringstring>' +
  '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
  '<Key>giftcard_' + data.aId + '.SenderName</Key>' +
  '<Value>' + data.aGiftCard.aSenderName + '</Value>' +
  '</KeyValueOfstringstring>';
body += productQuantityAttr;
body += '</inputValues></AddToCart></Body></Envelope>';

let method = 'AddToCart';
this.generalService.webService(body, method).then(response => {

  loader.dismiss();
  this.dataList = response;
  console.log("AddToCart service reposnse is:", response);
  this.dataList = JSON.parse(this.dataList._body);
  console.log("BODY RESPOSNE IS", this.dataList);


  if (this.dataList.aStatus == "Success") {
    console.log("Added to Cart");
    let toast = this.toastCtrl.create({
      message: this.addToCartText,
      cssClass: 'mytoast',
      duration: 1500
    });
    this.navCtrl.push(BuycarddetailsPage);
    toast.present(toast);

  }

}, error => {
  loader.dismiss();
  alert( MyApp.errorText);
});




}

  public goToPayPage(value) {
    // let options: NativeTransitionOptions = {
    //   direction: 'left',
    //   duration: 400,
    //   slowdownfactor: -1,
    //   iosdelay: 50,
    //   androiddelay:50,
    //  };
    // this.nativePageTransitions.slide(options);

    this.navCtrl.push(PayPage, {
      item: this.data
    });


}
ionViewWillLeave() {
  this.tabBarElement.style.display = 'flex';
}

}
