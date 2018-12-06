import { LoginPage } from './../login/login';
import { MyApp } from './../../app/app.component';
import { NativePageTransitions,NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { timeout } from 'rxjs/operator/timeout';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BuycarddetailsPage } from './../buycarddetails/buycarddetails';
import { BuycardconfirmPage } from './../buycardconfirm/buycardconfirm';
import { GeneralService } from "./../../providers/general-service/GeneralService";
import { LoadingController, Navbar, Segment, App } from "ionic-angular";
import { ToastController,AlertController, } from "ionic-angular";
import { TabsPage } from "./../tabs/tabs";
import { Component, ComponentFactoryResolver, ViewChild,ChangeDetectorRef } from "@angular/core";
import { IonicPage, NavController, NavParams,Platform } from "ionic-angular";
import { TranslateService } from "../../../node_modules/@ngx-translate/core";
import { LaunchNavigator, LaunchNavigatorOptions } from '../../../node_modules/@ionic-native/launch-navigator';


/**
 * Generated class for the SelectedcardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage({
  segment: 'selectedCard/:pId'

})

@Component({
  selector: "page-selectedcard",
  templateUrl: "selectedcard.html"
})
export class SelectedcardPage {

  cards: string;
  value: any;
  value2: any;
  tabBarElement: any;
  heartIconFull:boolean = false;
  amount: any = 1;
  responseFromVendor: any = "";

  emailOfVendor: any = "";
  nameOfVendor: any = "";
  length:any;
  @ViewChild(Navbar) navBar: Navbar;
  dataList : any = "";
  img: any;
  data: any = [];
  product: any = [];
  attributeData: any = [];
  addClassName: string = "";
  category: any = [];
  aDefaultPictureModel: any;
   static productId: any;
   user: string=  "";
   password: string = "";
   priceAttr: any;
   vendorModel: any = [];
   wishlistStatus: any = [];
  aId: any;
  addressOfVendor: any = [];
  addressIsEmpty: boolean =false;
  responseFromWishlist: {};
  productId: any;
  loadingDataText: any;
  pId: number;
  popover: any;

  //productId:any;

  constructor(
    public cf:ChangeDetectorRef,
    private launchNavigator: LaunchNavigator,
    public nativePageTransitions:NativePageTransitions,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public translate: TranslateService,
    public loadingCtrl: LoadingController,
    public generalService: GeneralService,
    private storage:Storage,
    private socialSharing: SocialSharing,
    public platform:Platform,
    public alertCtrl:AlertController,
    public app: App,
    // private callNumber: CallNumber
  ) {

    // translate.get('loadingDataText').subscribe(
    //   value => {
    //     // value is our translated string
    //      MyApp.loadingDataText = value;
    //      console.log(MyApp.loadingDataText,value);
    //   }
    // )
     //for removing tab in this page
     this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

    console.log('tabBarElement',this.tabBarElement)


    // this.value2 = navParams.get("items");
    // SelectedcardPage.productId = this.value2.aId;
    this.cards = "About Card";
    this.value = navParams.get("productData");


    this.storage.keys().then((res) => {
    });
    // Opening a Loader for Loding data
    let loader = this.loadingCtrl.create({
        content: MyApp.loadingDataText
    });





    loader.present();
    this.storage.get('usr').then((usr) => {
      this.user = usr;
        this.storage.get('pwd').then((pwd) => {


          if(!usr || !pwd){


            // let toast = this.toastCtrl.create({
            //   //assigning the Success message to toast
            //   message: MyApp.needToLoginFirstText,
            //   cssClass: 'mytoast',
            //   duration: 3500
            // });
            // toast.present(toast);
            this.navCtrl.setRoot(TabsPage)

          }





          this.password = pwd;
            this.GetProductDetails(usr,pwd,loader);

        });
    });







    // console.log("The data from the previous page is", this.value)
  }
ionViewDidLoad(){

  this.pId=this.navParams.get('pId');
  console.log("P ID is ",this.pId);
  SelectedcardPage.productId = this.pId;



}
ionViewDidEnter() {
  this.navBar.backButtonClick = () => this.navCtrl.pop({animate: false});
}

  public GetProductDetails (username,password,loader) {
      let requestDetail = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/"> <soapenv:Header/> <soapenv:Body> <tem:GetProductDetails> <tem:usernameOrEmail>'+username+'</tem:usernameOrEmail> <tem:userPassword>'+password+'</tem:userPassword> <tem:productId>'+SelectedcardPage.productId+'</tem:productId> </tem:GetProductDetails> </soapenv:Body> </soapenv:Envelope>';
      let methodDetail = 'GetProductDetails';
      this.generalService.webService(requestDetail,methodDetail).then(response => {

      this.dataList = response;
      this.dataList = JSON.parse(this.dataList._body);


      if (this.dataList) {
        if (this.dataList.aName.length > 0) {


          //For Wishlist Icon
          if(this.dataList.aInWishlist=="true"){
            this.heartIconFull=true;

          }
          else
          {
            this.heartIconFull=false;

          }

          this.data = this.dataList;
          this.productId= this.data.aId;

          this.aDefaultPictureModel= this.data.aDefaultPictureModel;
          this.product.price = this.data.aProductPrice.aPriceValue;
          this.vendorModel = this.dataList.aVendorModel;
          this.aId= this.vendorModel.aId;
          console.log( "VendorModel ID IS: ",this.aId);

          this.vendorLocationRequest(this.user,this.password,loader,this.aId);



          // this.product.priceAttributes = this.data
          if (this.data.aProductAttributes["aWebServiceProductDetails.ProductAttributeModel"].length > 0) {
            for (let attributes of this.data.aProductAttributes["aWebServiceProductDetails.ProductAttributeModel"]) {
                if(attributes.aName == "Price") {
                  if (attributes.aValues["aWebServiceProductDetails.ProductAttributeValueModel"].length > 0) {
                    this.attributeData = attributes.aValues["aWebServiceProductDetails.ProductAttributeValueModel"];
                    this.priceAttr = this.attributeData[0].aId;
                    this.data.FinalPriceAttr = this.priceAttr;
                    this.data.FinalPrice = parseInt(this.product.price) + parseInt(this.attributeData[0].aPriceAdjustmentValue);
                  }
                }
            }
          } else {
              let attributes = this.data.aProductAttributes["aWebServiceProductDetails.ProductAttributeModel"];
              if(attributes.aName == "Price") {
                if (attributes.aValues["aWebServiceProductDetails.ProductAttributeValueModel"].length > 0) {
                  this.attributeData = attributes.aValues["aWebServiceProductDetails.ProductAttributeValueModel"];
                  this.priceAttr = this.attributeData[0].aId;
                  this.data.FinalPriceAttr = this.priceAttr;
                  this.data.FinalPrice = parseInt(this.product.price) + parseInt(this.attributeData[0].aPriceAdjustmentValue);
                }
              }
          }
        } else {
          this.data['0'] = this.dataList;
        }
      } else {
        this.data = null;
      }
    }, error =>{
        loader.dismiss();
        alert( MyApp.errorText);
    });

  }

  private vendorLocationRequest (username,password,loader,aId) {

    let vendorLocationRequest = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/"> <soapenv:Header/> <soapenv:Body> <tem:GetVendor> <tem:usernameOrEmail>'+username+'</tem:usernameOrEmail> <tem:userPassword>'+password+'</tem:userPassword> <tem:vendorId>'+aId+'</tem:vendorId> </tem:GetVendor> </soapenv:Body> </soapenv:Envelope>';
    let vendorLocationMethod = 'GetVendor';
    this.generalService.webService(vendorLocationRequest,vendorLocationMethod).then(response => {

    this.responseFromVendor = response;

    if(this.responseFromVendor._body.length==2)
    {
     this.addressIsEmpty= true;
     loader.dismiss();

    }
    else{

    this.responseFromVendor = JSON.parse(this.responseFromVendor._body);
    this.nameOfVendor= this.responseFromVendor.aName;
    this.emailOfVendor = this.responseFromVendor.aEmail;


    if (this.responseFromVendor.aAddresses.aAddress) {
      if (this.responseFromVendor.aAddresses.aAddress.length > 0) {
        this.addressOfVendor = this.responseFromVendor.aAddresses.aAddress;
      } else {
        this.addressOfVendor['0'] = this.responseFromVendor.aAddresses.aAddress;
      }
    } else {
      this.addressOfVendor = null;
    }




    loader.dismiss();

    }

  }, error =>{
      loader.dismiss();
      alert( MyApp.errorText);
  });

}






  confirmPage(){

    if(this.user=="guest@apptech.com.tr" && this.password=="guest@apptech.com.tr"){
      this.openLoginToContinueDialogue();
    }

    else {
    if (this.platform.is('ios')) {


      // This will only print when on iOS
      this.navCtrl.push(BuycarddetailsPage,{item:this.data});

    }
    else{

    //ANIMATION Start

    // let options: NativeTransitionOptions = {
    //   direction: 'left',
    //   duration: 400,
    //   slowdownfactor: -1,
    //   iosdelay: 50,
    //   androiddelay:50,


    //  };

    // this.nativePageTransitions.slide(options);
    //ANIMATION END


    this.navCtrl.push(BuycarddetailsPage,{item:this.data});
  }
}
  }


  ionViewWillEnter() {


    // let options: NativeTransitionOptions = {
    //   direction: 'right',
    //   duration: 400,
    //   slowdownfactor: -1,
    //   iosdelay: 50,
    //   androiddelay:50,
    //  };
    //  this.nativePageTransitions.slide(options);
    debugger;
    let tabBarElement = document.querySelector('.tabbar.show-tabbar');
    if (tabBarElement != null) {
      this.tabBarElement.style.display = 'none'; // or whichever property which you want to access
    }
  }

  ionViewWillLeave() {
    let tabBarElement = document.querySelector('.tabbar.show-tabbar');
    if (tabBarElement != null) {
      this.tabBarElement.style.display = 'flex'; // or whichever property which you want to access
    }

    // let options: NativeTransitionOptions = {
    //   direction: 'left',
    //   duration: 400,
    //   slowdownfactor: -1,
    //   iosdelay: 50,
    //   androiddelay:50,
    //  };
    //  this.nativePageTransitions.slide(options);


  }


  addToWishList(event,data) {
    if(this.user=="guest@apptech.com.tr" && this.password=="guest@apptech.com.tr"){
      this.openLoginToContinueDialogue();
    }

    else {


    // Opening a Loader for Loding data
    let loader = this.loadingCtrl.create({
      content: MyApp.loadingDataText
    });

  loader.present();

    let CustomMessage = "Thank you! for adding this item to Wishlist";

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
              '<Value>'+CustomMessage+'</Value>'+
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
            '<Value>'+CustomMessage+'</Value>'+
          '</KeyValueOfstringstring>';
        }
    }


    let body = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"><Body><AddToWhishlist xmlns="http://tempuri.org/"><productId>'+data.aId+'</productId><quantity>1</quantity><usernameOrEmail>'+this.user+'</usernameOrEmail><userPassword>'+this.password+'</userPassword><inputValues>';
    body += dynamicAttributes;
    body +=     '<KeyValueOfstringstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">'+
                    '<Key>giftcard_'+data.aId+'.Message</Key>'+
                    '<Value>'+CustomMessage+'</Value>'+
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
          loader.dismiss();
          let alert = this.alertCtrl.create({
          title: MyApp.addFavText,
          buttons:[MyApp.okayText]
        });
        console.log(MyApp.addFavText);
        alert.present();
          this.heartIconFull=true;
      },error =>{
        loader.dismiss();
        alert( MyApp.errorText);

      });

    }
  }

  share(event,data) {
    console.log(data);
      this.socialSharing.share(data.aMetaDescription,data.aName,data.aDefaultPictureModel.aFullSizeImageUrl,'https://bahjahcards.com/bahjah/?productId='+data.aId).then(() => {
      }).catch(() => {
        // Error!
      });;
  }

  convertToInteger(price, attrPrice){
    let totalPrice = parseInt(price) + parseInt(attrPrice);
    return totalPrice;
  }

  priceAttrOnChange(event) {
    // taking the price of attributes out with attribute value id coming from onchange of select box event
    for (let attrValue of this.attributeData ) {
       if (attrValue.aId == event) {
          this.data.FinalPrice = parseInt(attrValue.aPriceAdjustmentValue) + parseInt(this.product.price);
       }
    }
    // setting finalPriceAttr as attribute price Id
    this.data.FinalPriceAttr = event;
  }
   public removeFromWishlist(){

    let methodofWishlist = "DeleteFromWishlist";
    let requestofWishlist = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"> <Body> <DeleteFromWishlist xmlns="http://tempuri.org/"> <productId>'+this.productId+'</productId> <usernameOrEmail>'+this.user+'</usernameOrEmail> <userPassword>'+this.password+'</userPassword> </DeleteFromWishlist> </Body> </Envelope>';

    let loader = this.loadingCtrl.create({
      content: MyApp.loadingDataText
    });

  loader.present();
    this.generalService.webService(requestofWishlist,methodofWishlist).then(
      responseWishlist => {

        this.responseFromWishlist = responseWishlist;

        console.log("From DeleteFromWishlistResponse",responseWishlist);
        loader.dismiss();

        this.heartIconFull=false; //to make heart icon empty

        // let toast = this.toastCtrl.create({
        //   message: this.removeWishlistText,
        //   duration: 91500,
        let alert = this.alertCtrl.create({
          title:MyApp.removedFavText,
          buttons:[MyApp.okayText]
        });
        alert.present();





        // });
        // toast.present(toast);


      },
      error => {

        console.log(error);
        alert(MyApp.errorText);

      }
    );









  }

  openNavigation(address){
    let options: LaunchNavigatorOptions = {
      // app: LaunchNavigator.APPS.UBER
    };

    this.launchNavigator.navigate(address, options)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );

  }
  segmentChanged()
{
this.cf.detectChanges();

}
openDialPad(aPhoneNumber){
  console.log(aPhoneNumber)
  // this.callNumber.callNumber(aPhoneNumber, true)
  // .then(res => console.log('Launched dialer!', res))
  // .catch(err => console.log('Error launching dialer', err));
}

openLoginToContinueDialogue(){
  let alert = this.alertCtrl.create({
    title: 'Login to Continue',
    message: 'Do you want to login into this app?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Login',
        handler: () => {
          this.app.getRootNav().setRoot(LoginPage);
        }
      }
    ]
  });
  alert.present();
}



}
