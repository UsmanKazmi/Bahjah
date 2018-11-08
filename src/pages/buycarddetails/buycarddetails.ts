import { MyApp } from './../../app/app.component';
import { NativePageTransitions,NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { LoginPage } from './../login/login';
import { Storage } from '@ionic/storage';
import { GeneralService } from './../../providers/general-service/GeneralService';
import { LoadingController, Slides, Platform, Navbar } from 'ionic-angular';
import { BuycardconfirmPage } from './../buycardconfirm/buycardconfirm';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BuycardcheckoutPage } from '../buycardcheckout/buycardcheckout';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';



/**
 * Generated class for the BuycarddetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-buycarddetails',
  templateUrl: 'buycarddetails.html',

})
export class BuycarddetailsPage {
  @ViewChild(Slides) slides: Slides;
  categories: string ;
  tabBarElement: any;
  value: any = [];
  detailPageData:any = [];
  aDefaultPictureModel: any;
  aImageUrl:any;
  selectedSegment: any= '';
  dataList: any;
  password: any;
  user: any;
  pictureArray: any= [];
  pictureArray2: any= [];
  @ViewChild(Navbar) navBar: Navbar;
  aProductPictureModel: any= [];
  imageFromArray2: any=[];
  activeSlide:number;
  GiftCardImageUrl: string = "";
  slideCase: any=[];
  slideCaseAID: any;
  isOneSlide: boolean = false;

  constructor(public platform:Platform,private nativePageTransitions:NativePageTransitions,public translate: TranslateService,public loadingCtrl:LoadingController,public generalService:GeneralService,public navCtrl: NavController,public navParams: NavParams,public storage:Storage)
  {
    this.storage.get("usr").then((usr) => {
      this.user= usr;
    });

    this.storage.get('pwd').then((pwd) => {
        this.password = pwd;
    });

    setTimeout( () => {
      if (this.user != "" && this.user != null && this.password != "" && this.password != null  ) {
        this.GetProductPicturesBySelectedCategory(this.user,this.password);

      } else {
        this.navCtrl.setRoot(LoginPage);

      }
    }, 500);





  this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  this.detailPageData = navParams.get("item");
  this.aDefaultPictureModel = this.detailPageData.aDefaultPictureModel;
  this.aImageUrl=this.aDefaultPictureModel.aImageUrl;
  console.log("Picture is",this.aImageUrl);
  console.log(this.detailPageData);


  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad BuycarddetailsPage');
  }
  openCheckoutPage(){

    if (this.platform.is('ios')) {
      // This will only print when on iOS
      console.log('I am an iOS device!');

    }
    this.navCtrl.push(BuycardcheckoutPage,{
        item: this.detailPageData
    });

  }
  skipPage(){
    this.navCtrl.push(BuycardconfirmPage);
  }
  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }
   gotoConfirmCardPage() {

    if (this.platform.is('ios')) {
      // This will only print when on iOS
      console.log('I am an iOS device!');
      this.detailPageData.GiftCardImageUrl = "";
      this.navCtrl.push(BuycardcheckoutPage, {
        item: this.detailPageData
      });

    }

    else{
    this.detailPageData.GiftCardImageUrl = "";
    this.navCtrl.push(BuycardcheckoutPage, {
      item: this.detailPageData
    });
  }
}

  onNextButton(){
    this.activeSlide=this.slides.getActiveIndex();
    let grabImage = document.getElementById('GiftCardImageUrl'+this.activeSlide) ;

    debugger;
    console.log('image src',grabImage)
    this.detailPageData.GiftCardImageUrl = grabImage;


    if (this.platform.is('ios')) {
      // This will only print when on iOS
      console.log('I am an iOS device!');
      this.navCtrl.push(BuycardcheckoutPage, {
        item: this.detailPageData
      });

    }

    else{
    // let options: NativeTransitionOptions = {
    //   direction: 'left',
    //   duration: 400,
    //   slowdownfactor: -1,
    //   iosdelay: 50,
    //   androiddelay:50,
    //  };

    // this.nativePageTransitions.slide(options);

    this.navCtrl.push(BuycardcheckoutPage, {
      item: this.detailPageData
    });
  }
  }



  private changeSegment(event, value) {
    // this.categories = value;
    // this.selectedSegment=this.dataList.aProductPictures[0].aName;
    // this.categories = this.selectedSegment;

  }

  public GetProductPicturesBySelectedCategory(username,password){


    let loader = this.loadingCtrl.create({
      content: MyApp.loadingDataText
    });

    loader.present();

    let method = "GetProductPicturesBySelectedCategory";
    let body  = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"> <Body> <GetProductPicturesBySelectedCategory xmlns="http://tempuri.org/"> <usernameOrEmail>'+username+'</usernameOrEmail> <userPassword>'+password+'</userPassword> <categoryId>19</categoryId> </GetProductPicturesBySelectedCategory> </Body> </Envelope>';

    this.generalService.webService(body, method).then(
      response => {
        loader.dismiss();
        this.dataList = response;
        console.log("GetProductPicturesBySelectedCategory service reposnse is:", response);
        this.dataList = JSON.parse(this.dataList._body);
        console.log("BODY RESPOSNE IS", this.dataList);

        if (this.dataList.aProductPictures.length > 0) {
          this.pictureArray=this.dataList.aProductPictures;
        } else {
          this.pictureArray['0']=this.dataList.aProductPictures;
        }

        this.selectedSegment= this.dataList.aName;
        let TIME_IN_MS = 500;

        let hideFooterTimeout = setTimeout( () => {
          this.getSelectedTab(this.pictureArray[0] ,this.pictureArray[0].aId )
        }, TIME_IN_MS);

        if (this.dataList.aProductPictures.length > 0) {
          this.selectedSegment=this.dataList.aProductPictures[0].aName;
        }

        this.categories = this.selectedSegment;


      },
      error => {
        loader.dismiss();
        alert(MyApp.errorText);
      }
    );

    }


  getSelectedTab(slide, aid){
    setTimeout(() => {

      this.slides.slideTo(0); // The 0 will avoid the transition of the slides to be shown
    }, 300)
    if (slide.aProductImagesModel.aProductPictureModel.length > 0) {
      this.slideCase = [];
      this.slideCase = slide.aProductImagesModel.aProductPictureModel
      console.log("NOt ONE SLIDE")
      this.slides.lockSwipes(false)

    } else {

      this.slides.lockSwipes(false)

      this.isOneSlide=true
      console.log("ONLY ONE SLIDE")
      this.slideCase = [];
      this.slideCase['0'] = slide.aProductImagesModel.aProductPictureModel;

      if(this.isOneSlide==true){

        this.slides.lockSwipes(true)


      }
    }
    this.isOneSlide=false;

    this.slideCaseAID = aid;
    this.selectedSegment= slide.aName;
    this.categories=slide.aName;

  }

  ionViewDidEnter() {
      this.navBar.backButtonClick = () => this.navCtrl.pop({animate: false});
    console.log(this.translate.getBrowserLang());
    if (this.translate.getDefaultLang() == 'ar') {
      console.log(this.translate.getDefaultLang());
     this.slides._rtl = true;
    }
    console.log("ionViewDidEnter");
  }

      //To disable swiping on the last slide and first slide
  toCheckifLastSlide(){

    if(this.isOneSlide==true){

      this.slides.lockSwipes(true)

    }

    else {

    this.isOneSlide=false;
    this.storage.get('lang').then((value) => {

      // this.slides.lockSwipeToPrev(false);
      // this.slides.lockSwipeToNext(false);

      if (value == "en") {


        if(this.slides.isBeginning()==true){
          this.slides.lockSwipeToNext(false);
          this.slides.lockSwipeToPrev(true);

        }
        else if(this.slides.isEnd()==true){
          this.slides.lockSwipeToPrev(false);
          this.slides.lockSwipeToNext(true);


        }
        else {
          this.slides.lockSwipeToPrev(false);
          this.slides.lockSwipeToNext(false);
        }


      } else {



        if(this.slides.isBeginning()==true){
          this.slides.lockSwipeToNext(false);

          this.slides.lockSwipeToPrev(true);

        }
        else if(this.slides.isEnd()==true){
          this.slides.lockSwipeToPrev(false);

          this.slides.lockSwipeToNext(true);


        }
      }
    }

    );
  }
}



removezero(item) {
  let itemToConvert =  item.aPrice.toString();
  let newValue = itemToConvert.split('.')[0];
  return newValue;
  }
}
