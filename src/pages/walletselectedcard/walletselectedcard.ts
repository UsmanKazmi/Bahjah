import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GeneralService } from './../../providers/general-service/GeneralService';
import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { SocialSharing } from '../../../node_modules/@ionic-native/social-sharing';
import { MyApp } from '../../app/app.component';
/**
 * Generated class for the WalletselectedcardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-walletselectedcard',
  templateUrl: 'walletselectedcard.html',
})
export class WalletselectedcardPage {

  CustomMessage:string= "Thank you! for adding this item to Wishlist";

  addressIsEmpty:boolean = false;
  cards: string;
  value: any;
  value2: any;
  tabBarElement: any;
  amount: any = 1;
  responseFromVendor: any = "";
  emailOfVendor: any = "";
  nameOfVendor: any = "";
  dataList : any = "";
  img: any;
  data: any = [];
  product: any = [];
  attributeData: any = [];
  addClassName: string = "";
  category: any = [];
  aDefaultPictureModel: any;
  productId: any;
  user: string=  "";
  password: string = "";
  priceAttr: any;
  vendorModel: any = [];
  wishListText: string = "Added to favourites";
  wishlistStatus: any = [];
  aId: any;
  addressOfVendor: any = [];
  dataFromGetProductDetails: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController,
    public translate: TranslateService,
    public loaderCtrl: LoadingController,
    public generalService: GeneralService,
    private socialSharing: SocialSharing,

    private storage:Storage) {


      let loader = this.loaderCtrl.create({
        content:MyApp.loadingDataText
    });
    this.storage.get("usr").then((usr) => {
      this.user= usr;
    });

    this.storage.get('pwd').then((pwd) => {
        this.password = pwd;
    });

    loader.present();
      setTimeout( () => {
        this.data=this.navParams.get('dataFromGetProductDetails');
        console.log("dataFromGetProductDetails",this.data)
        this.cards = "About Card";
        this.vendorLocationRequest(this.user,this.password,this.data.aId);
        loader.dismiss();
      }, 3000);


  }


//   public GetProductDetails (username,password,productId) {
//     let requestDetail = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/"> <soapenv:Header/> <soapenv:Body> <tem:GetProductDetails> <tem:usernameOrEmail>'+username+'</tem:usernameOrEmail> <tem:userPassword>'+password+'</tem:userPassword> <tem:productId>'+productId+'</tem:productId> </tem:GetProductDetails> </soapenv:Body> </soapenv:Envelope>';
//     let methodDetail = 'GetProductDetails';
//     this.generalService.webService(requestDetail,methodDetail).then(response => {

//     this.dataList = response;
//     this.dataList = JSON.parse(this.dataList._body);
//     console.log(this.dataList);


//     if (this.dataList) {
//       if (this.dataList.aName.length > 0) {
//         this.data = this.dataList;
//         this.aDefaultPictureModel= this.data.aDefaultPictureModel;
//         this.product.price = this.data.aProductPrice.aPriceValue;
//         this.vendorModel = this.dataList.aVendorModel;
//         this.aId= this.vendorModel.aId;
//         console.log( "VendorModel ID IS: ",this.aId);

//         this.vendorLocationRequest(this.user,this.password,this.aId);



//         // this.product.priceAttributes = this.data
//         if (this.data.aProductAttributes["aWebServiceProductDetails.ProductAttributeModel"].length > 0) {
//           for (let attributes of this.data.aProductAttributes["aWebServiceProductDetails.ProductAttributeModel"]) {
//               if(attributes.aName == "Price") {
//                 if (attributes.aValues["aWebServiceProductDetails.ProductAttributeValueModel"].length > 0) {
//                   this.attributeData = attributes.aValues["aWebServiceProductDetails.ProductAttributeValueModel"];
//                   this.priceAttr = this.attributeData[0].aId;
//                   this.data.FinalPriceAttr = this.attributeData[0].aId;
//                   this.data.FinalPrice = parseInt(this.product.price) + parseInt(this.attributeData[0].aPriceAdjustmentValue);
//                 }
//               }
//           }
//         } else {
//             let attributes = this.data.aProductAttributes["aWebServiceProductDetails.ProductAttributeModel"];
//             if(attributes.aName == "Price") {
//               if (attributes.aValues["aWebServiceProductDetails.ProductAttributeValueModel"].length > 0) {
//                 this.attributeData = attributes.aValues["aWebServiceProductDetails.ProductAttributeValueModel"];
//                 this.priceAttr = this.attributeData[0].aId;
//               }
//             }
//         }
//       } else {
//         this.data['0'] = this.dataList;
//       }
//     } else {
//       this.data = null;
//     }
//   }, error =>{
//       alert( MyApp.errorText);
//   });

// }


public vendorLocationRequest (username,password,aId) {



  let vendorLocationRequest = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/"> <soapenv:Header/> <soapenv:Body> <tem:GetVendor> <tem:usernameOrEmail>'+username+'</tem:usernameOrEmail> <tem:userPassword>'+password+'</tem:userPassword> <tem:vendorId>'+aId+'</tem:vendorId> </tem:GetVendor> </soapenv:Body> </soapenv:Envelope>';
  let vendorLocationMethod = 'GetVendor';
  this.generalService.webService(vendorLocationRequest,vendorLocationMethod).then(response => {
  this.responseFromVendor = response;

  if(this.responseFromVendor._body.length==2)
  {
   this.addressIsEmpty= true;
  }
  else{
  console.log("FirstResponse",this.responseFromVendor);

  this.responseFromVendor = JSON.parse(this.responseFromVendor._body);
  console.log("SecondResponse",this.responseFromVendor);
  this.nameOfVendor= this.responseFromVendor.aName;
  console.log("ThirdResponse",this.responseFromVendor);
  this.emailOfVendor = this.responseFromVendor.aEmail;
  this.addressOfVendor = this.responseFromVendor.aAddresses.aAddress;


  }


}, error =>{
    alert( MyApp.errorText);
});

}




addToWishList(event,data) {

  // Opening a Loader for Loading data



  // this.translate.get("ERROR: Customer does not exist").subscribe(value => {

  // });
  let dynamicAttributes = '';
  let productQuantityAttr = '';


  if (data.aProductAttributes["aWebServiceProductDetails.ProductAttributeModel"].length > 0) {
    for (let attributes of data.aProductAttributes["aWebServiceProductDetails.ProductAttributeModel"]) {
        if(attributes.aName == "Price") {
          dynamicAttributes = '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">'+
            '<Key>product_attribute_'+attributes.aId+'</Key>'+
            '<Value>'+this.priceAttr+'</Value>'+
          '</KeyValueOfstringstring>';

          productQuantityAttr = '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">'+
              '<Key>product_attribute_'+attributes.aId+'_'+this.priceAttr+'_qty</Key>'+
              '<Value>1</Value>'+
          '</KeyValueOfstringstring>';

        } else {
          dynamicAttributes += '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">'+
            '<Key>product_attribute_'+attributes.aId+'</Key>'+
            '<Value>'+this.CustomMessage+'</Value>'+
          '</KeyValueOfstringstring>';
        }
    }
  } else {
      let attributes = data.aProductAttributes["aWebServiceProductDetails.ProductAttributeModel"];
      if(attributes.aName == "Price") {
        dynamicAttributes = '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">'+
          '<Key>product_attribute_'+attributes.aId+'</Key>'+
          '<Value>'+this.priceAttr+'</Value>'+
        '</KeyValueOfstringstring>';

        productQuantityAttr = '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">'+
            '<Key>product_attribute_'+attributes.aId+'_'+this.priceAttr+'_qty</Key>'+
            '<Value>1</Value>'+
        '</KeyValueOfstringstring>';

      } else {
        dynamicAttributes += '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">'+
          '<Key>product_attribute_'+attributes.aId+'</Key>'+
          '<Value>'+this.CustomMessage+'</Value>'+
        '</KeyValueOfstringstring>';
      }
  }


  let body = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"><Body><AddToWhishlist xmlns="http://tempuri.org/"><productId>'+data.aId+'</productId><quantity>1</quantity><usernameOrEmail>'+this.user+'</usernameOrEmail><userPassword>'+this.password+'</userPassword><inputValues>';
  body += dynamicAttributes;
  body +=     '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">'+
                  '<Key>giftcard_'+data.aId+'.Message</Key>'+
                  '<Value>'+this.CustomMessage+'</Value>'+
              '</KeyValueOfstringstring>'+
              '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">'+
                  '<Key>giftcard_'+data.aId+'.RecipientEmail</Key>'+
                  '<Value>'+data.aGiftCard.aSenderEmail+'</Value>'+
              '</KeyValueOfstringstring>'+
              '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">'+
                  '<Key>giftcard_'+data.aId+'.RecipientName</Key>'+
                  '<Value>'+data.aGiftCard.aSenderName+'</Value>'+
              '</KeyValueOfstringstring>'+
              '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">'+
                  '<Key>giftcard_'+data.aId+'.SenderEmail</Key>'+
                  '<Value>'+data.aGiftCard.aSenderEmail+'</Value>'+
              '</KeyValueOfstringstring>'+
              '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">'+
                  '<Key>giftcard_'+data.aId+'.SenderName</Key>'+
                  '<Value>'+data.aGiftCard.aSenderName+'</Value>'+
              '</KeyValueOfstringstring>';
    body += productQuantityAttr;
    body +=    '</inputValues></AddToWhishlist></Body></Envelope>';

    let method = 'AddToWhishlist';
    this.generalService.webService(body,method).then(response => {
        console.log(response);
        let toast = this.toastCtrl.create({
          message: this.wishListText,
          cssClass: 'mytoast',
          duration: 1500
        });
        toast.present(toast);

    },error =>{
      alert( MyApp.errorText);

    });


}

share(event,data) {
    this.socialSharing.share(data.aFullDescription,data.aName,data.aDefaultPictureModel.aFullSizeImageUrl,"http://bahjah.azurewebsites.net").then(() => {
      console.log('shared');
    }).catch(() => {
      // Error!
    });;
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletselectedcardPage');
  }

}
