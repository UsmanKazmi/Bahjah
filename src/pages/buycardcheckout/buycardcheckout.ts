import { MyApp } from './../../app/app.component';
import { HomePage } from './../home/home';
import { Storage } from '@ionic/storage';
import { GeneralService } from './../../providers/general-service/GeneralService';
import { ToastController, AlertController, Navbar } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BuycardconfirmPage } from '../buycardconfirm/buycardconfirm';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { NativePageTransitions,NativeTransitionOptions } from '@ionic-native/native-page-transitions';


/**
 * Generated class for the BuycardcheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-buycardcheckout',
  templateUrl: 'buycardcheckout.html',
})

export class BuycardcheckoutPage {
  @ViewChild(Navbar) navBar: Navbar;

  GiftCardImageUrlText: string = "";
  GiftCardImageUrl(arg0: any, arg1: any): any {
    throw new Error("Method not implemented.");
  }
  public hexColor: string = '#000000';
  tabBarElement: any;
  data: any = [];
  dataList: any =[];
  body: any =[];

  private user: string = "";
  private password: string = "";
  private priceAttr: any = 0;
  removeEmptySpacesPattern = /^[a-zA-Z0-9]*$/i;
  validNameText: string = "Please Enter a valid Name";

  //for Input from the form
  public name : string = "";
  public email:string = "";
  public mobile:any ;
  public giftText: string = "";
  showButton: boolean = true;
  hideButton: boolean = false;
   public static giftMessageheading: boolean = true;
   giftMessageHeading_UI:boolean = true;
  HomePage: any;
  currentSrc:any= "empty"

  productImageFromUrl: any=[];
  constructor( private nativePageTransitions:NativePageTransitions,public navCtrl: NavController, private storage:Storage, public navParams: NavParams, private loadingCtrl: LoadingController, private toast: ToastController, private generalService: GeneralService, public alertCtrl:AlertController) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    debugger;

    //FOR VALIDATING THE FORM
    // this.formgroup = formbuilder.group({
    //   name: ['', [Validators.required, Validators.minLength(4),Validators.pattern(this.removeEmptySpacesPattern)]],
    //   email: ['', [Validators.required, Validators.minLength(4),Validators.pattern(this.removeEmptySpacesPattern)]],
    //   mobile: ['', [Validators.required, Validators.minLength(4),Validators.pattern(this.removeEmptySpacesPattern)]],
    //   giftText: ['', [Validators.required, Validators.minLength(4)]]

    // });

    // this.email = this.formgroup.controls['email'];
    // this.mobile = this.formgroup.controls['mobile'];
    // this.giftText = this.formgroup.controls['giftText'];

    console.log( "FORM DATA IS",this.name, this.email,this.mobile,this.giftText);






    this.data = navParams.get("item");
    console.log("THE DATA IS",this.data)
    if( this.data.GiftCardImageUrl!=null){

      //this is due to the fact that currentSrc ios not directly accessible through DOM

      this.data.GiftCardImageUrl = this.data.GiftCardImageUrl.currentSrc;

    }
    else {
      let alert = this.alertCtrl.create({
        title:MyApp.chooseGiftCardText,
        buttons:[MyApp.okayText]
      });
      alert.present();
      this.navCtrl.pop();
    }

    console.log("THE PRODUCT URL FOR THE SELECTED IMAGE IS",this.data)


    this.storage.get("usr").then(usr => {
      this.user = usr;
      this.storage.get("pwd").then(pwd => {
        this.password = pwd;
      });
    });
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad BuycardcheckoutPage');

  }


  openConfirmPayment(){
    var reg = new RegExp(/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/);

    // var reg = new RegExp(/^(\u0660\u0660\u0669\u0666\u0666\u0665|\u0669\u0666\u0666\u0665|\+\u0669\u0666\u0666\u0665|\u0660\u0665|\u0665)(\u0665|\u0660|\u0663|\u0666|\u0664|\u0669|\u0661|\u0668|\u0667)([\u0660-\u0669]{\u0667})$/);

    // var reg = new RegExp(/[\u0660-\u0669]|[0-9]/);

debugger;


    if(this.name=="" || this.mobile=="" ||this.email=="" ){
      let alert = this.alertCtrl.create({
        title:MyApp.fieldEmptyText,
        buttons:['OK']
      });
      alert.present();
    }
    else if (reg.test(this.mobile)==false){

      let alert = this.alertCtrl.create({
        title:MyApp.invalidPhone,
        buttons:[MyApp.okayText]
      });
      alert.present();
    }


    else {
    console.log( "FORM DATA IS",this.name, this.email,this.mobile,this.giftText);

    let loader = this.loadingCtrl.create({
      content:MyApp.loadingDataText
    });

    loader.present();

    let method = "AddToCart";
    let body  = this.attributeDataParse(this.data,method);

    this.generalService.webService(body, method).then(
      response => {
        loader.dismiss();
        this.dataList = response;
        console.log("Wish List service reposnse is:", response);
        this.dataList = JSON.parse(this.dataList._body);
        console.log("BODY RESPOSNE IS", this.dataList.aMessages.bstring);
        this.body= this.dataList.aMessages.bstring;

        if (this.dataList.aStatus == "Success") {
          let toast = this.toast.create({
            message: MyApp.proceedToCheckOutText,
            cssClass: "mytoast",
            duration: 1500
          });
          toast.present(toast);

          //For animation
          // let options: NativeTransitionOptions = {
          //   direction: 'left',
          //   duration: 400,
          //   slowdownfactor: -1,
          //   iosdelay: 50,
          //   androiddelay:50,
          //  };
          // this.nativePageTransitions.slide(options);
          //For animation

          this.navCtrl.push(BuycardconfirmPage, {
            reciepentName:this.name,
            reciepentEmail:this.email,
            reciepentgifttext:this.giftText,
            item: this.data,
          });
        }

        else   {
          let toast = this.toast.create({
            message: this.body,
            cssClass: "mytoast",
            duration: 3500
          });
          toast.present(toast);

        }
      },
      error => {
        loader.dismiss();
        alert(MyApp.errorText);
      }
    );


  }

}
ionViewWillEnter() {
  this.navBar.backButtonClick = () => this.navCtrl.pop({animate: false});
  this.tabBarElement.style.display = 'none';
  document.getElementById("fullcolor_forSendToPersonalButton").className = "toggleButton2";
}

ionViewWillLeave() {
  this.tabBarElement.style.display = 'flex';
}

attributeDataParse (data,method) {
  let CustomMessage = "Thank you! for adding this item to Wishlist";

  // this.translate.get("ERROR: Customer does not exist").subscribe(value => {

  // });
  let dynamicAttributes = "";
  let productQuantityAttr = "";

  if (data.aProductAttributes["aWebServiceProductDetails.ProductAttributeModel"].length > 0) {
      this.priceAttr=data.FinalPriceAttr;

      for (let attributes of data.aProductAttributes["aWebServiceProductDetails.ProductAttributeModel"]) {
      if (attributes.aName == "Price") {
        dynamicAttributes = '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
"<Key>product_attribute_" +
          attributes.aId +
          "</Key>" +
          "<Value>" +
          this.priceAttr +
          "</Value>" +
          "</KeyValueOfstringstring>";

        productQuantityAttr =
          '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
          "<Key>product_attribute_" +
          attributes.aId +
          "_" +
          this.priceAttr +
          "_qty</Key>" +
          "<Value>1</Value>" +
          "</KeyValueOfstringstring>";
      } else {
        dynamicAttributes +=
          '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
          "<Key>product_attribute_" +
          attributes.aId +
          "</Key>" +
          "<Value>" +
          CustomMessage +
          "</Value>" +
          "</KeyValueOfstringstring>";
      }
    }
  } else {
    let attributes = data.aProductAttributes["aWebServiceProductDetails.ProductAttributeModel"];
    if (attributes.aName == "Price") {
      this.priceAttr=data.FinalPriceAttr;
      dynamicAttributes =
        '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
        "<Key>product_attribute_" +
        attributes.aId +
        "</Key>" +
        "<Value>" +
        this.priceAttr +
        "</Value>" +
        "</KeyValueOfstringstring>";

      productQuantityAttr =
        '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
        "<Key>product_attribute_" +
        attributes.aId +
        "_" +
        this.priceAttr +
        "_qty</Key>" +
        "<Value>1</Value>" +
        "</KeyValueOfstringstring>";
    } else {
      dynamicAttributes +=
        '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
        "<Key>product_attribute_" +
        attributes.aId +
        "</Key>" +
        "<Value>" +
        CustomMessage +
        "</Value>" +
        "</KeyValueOfstringstring>";
    }
  }

  let body =
    '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"><Body><'+method+' xmlns="http://tempuri.org/"><productId>' +
    data.aId +
    "</productId><quantity>1</quantity><usernameOrEmail>" +
    this.user +
    "</usernameOrEmail><userPassword>" +
    this.password +
    "</userPassword><inputValues>";
  body += dynamicAttributes;
  body +=
    '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
    "<Key>giftcard_" +
    data.aId +
    ".Message</Key>" +
    "<Value>" +
    this.giftText +
    "</Value>" +
    "</KeyValueOfstringstring>" +
    '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
    "<Key>giftcard_" +
    data.aId +
    ".RecipientEmail</Key>" +
    "<Value>" +
    this.email +
    "</Value>" +
    "</KeyValueOfstringstring>" +
    '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
    "<Key>giftcard_" +
    data.aId +
    ".RecipientName</Key>" +
    "<Value>" +
    this.name +
    "</Value>" +
    "</KeyValueOfstringstring>" +
    '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
    "<Key>giftcard_" +
    data.aId +
    ".SenderEmail</Key>" +
    "<Value>" +
    data.aGiftCard.aSenderEmail +
    "</Value>" +
    "</KeyValueOfstringstring>" +
    '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
    "<Key>giftcard_" +
    data.aId +
    ".SenderName</Key>" +
    "<Value>" +
    data.aGiftCard.aSenderName +
    "</Value>" +
    "</KeyValueOfstringstring>";
  body += productQuantityAttr;
  body += "</inputValues></"+method+"></Body></Envelope>";
  return body;
}
personalButton(){
console.log("personalButton is clicked");
this.name=this.data.aGiftCard.aSenderName;
this.email=this.data.aGiftCard.aSenderEmail;
console.log("Hide BUtton",this.hideButton)
this.showButton=undefined;
this.hideButton=undefined;
BuycardcheckoutPage.giftMessageheading=undefined;
this.giftMessageHeading_UI=BuycardcheckoutPage.giftMessageheading;
this.mobile = HomePage.dataFromPhoneNumber;
document.getElementById("fullcolor_forSendToFriendButton").className = "toggleButton2";
document.getElementById("fullcolor_forSendToPersonalButton").className = "toggleButton1";


console.log("dATA IS",this.data)

}
sendToFriendButton(){
  this.mobile = "";

  console.log("sendToFriendButton is clicked");
  this.name="";
  this.email="";
  console.log("SHowButton",this.showButton)
  BuycardcheckoutPage.giftMessageheading=true;
  this.giftMessageHeading_UI=BuycardcheckoutPage.giftMessageheading;


  document.getElementById("fullcolor_forSendToPersonalButton").className = "toggleButton2";
  document.getElementById("fullcolor_forSendToFriendButton").className = "toggleButton1";


  this.hideButton=false;

  this.showButton=true;


}


}
