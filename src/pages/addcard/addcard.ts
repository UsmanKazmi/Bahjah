import { LoginPage } from './../login/login';
import { ScanqrPage } from './../scanqr/scanqr';
import { MyApp } from './../../app/app.component';
import { TabsPage } from "./../tabs/tabs";
import { HomePage } from "./../home/home";
import { GeneralService } from "./../../providers/general-service/GeneralService";
import { ToastController, Platform, App } from "ionic-angular";
import { AddcardserialPage } from "./../addcardserial/addcardserial";
import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  LoadingController,
  AlertController
} from "ionic-angular";
import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner";
import {
  NativePageTransitions,
  NativeTransitionOptions
} from "@ionic-native/native-page-transitions";
import { AddcardsuccessPage } from "../addcardsuccess/addcardsuccess";


@Component({
  selector: "page-addcard",
  templateUrl: "addcard.html"
})
export class AddcardPage {
  public text: any;
  qrcode: any;
  category: any = [];
  statusText: any;
  aWebServiceAddWallet: any = [];
  password: any;
  username: any;
  unregisterBackButtonAction: any;
  isCameraOpen: boolean = false;

  constructor(
    public loadingCtrl: LoadingController,
    public generalService: GeneralService,
    public alertCtrl: AlertController,
    public nativePageTransitions: NativePageTransitions,
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    private qrScanner: QRScanner,
    public toastCtrl: ToastController,
    public app: App,

  ) {
    this.username = HomePage.dataFromEmail;
    this.password = HomePage.dataFromPassword;




  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AddcardPage");
  }
  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  ionViewDidEnter() {
    if(this.username=="guest@apptech.com.tr" && this.password=="guest@apptech.com.tr"){

      this.openLoginToContinueDialogue();
    }
    else {

    this.initializeBackButtonCustomHandler();}

  }
  public initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(
      () => {
        this.customHandleBackButton();
      },
      10
    );
  }
  private customHandleBackButton(): void {
    if (this.isCameraOpen == true) {
      window.document
        .querySelector("body")
        .classList.remove("transparent-body");
        this.isCameraOpen =false;
        this.qrScanner.destroy(); // hide camera preview

    } else {
      this.navCtrl.getByIndex(0);
      this.navCtrl.parent.select(0);
    }
  }

  scanSerial() {
    this.qrScanner
      .prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // this.platform.registerBackButtonAction(() => {
          // });

          let scanSub = this.qrScanner.scan().subscribe(text => {
            console.log("Scanned something", text);
            this.qrcode = text;
            this.AddToWalletByCouponCodeService(
              this.username,
              this.password,
              this.qrcode
            );

            this.qrScanner.destroy(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning

            window.document
              .querySelector("body")
              .classList.remove("transparent-body");
            // let toast = this.toastCtrl.create({

            //   //assigning the success message to toast only
            //   message: text,
            //   duration: 1500
            // });
            // toast.present(toast);
          });
          window.document
            .querySelector("body")
            .classList.add("transparent-body");
          this.isCameraOpen = true;

          this.qrScanner.show();
        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log("Error is", e));
  }
  public addSerial() {
    // let options: NativeTransitionOptions = {
    //   direction: "left",
    //   duration: 400,
    //   slowdownfactor: -1,
    //   iosdelay: 50,
    //   androiddelay: 50
    // };
    // this.nativePageTransitions.slide(options);
    this.navCtrl.push('AddcardserialPage',{
      // couponCode:couponCode,
  });  }

  AddToWalletByCouponCodeService(username, password, couponCode) {
    let loader = this.loadingCtrl.create({
      content: MyApp.verifyText
    });
    loader.present();

    let requestCategory =
      '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"> <Body> <AddToWalletByCouponCode xmlns="http://tempuri.org/"> <usernameOrEmail>' +
      username +
      "</usernameOrEmail> <userPassword>" +
      password +
      "</userPassword> <coupon>" +
      couponCode +
      "</coupon> </AddToWalletByCouponCode> </Body> </Envelope>";
    let methodCategory = "AddToWalletByCouponCode";

    this.generalService.webService(requestCategory, methodCategory).then(
      response => {
        this.category = response;

        this.statusText = this.category.statusText;
        console.log(this.statusText);

        if (this.statusText == "OK") {
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
          loader.dismiss();
        } else {
        }
      },
      error => {
        loader.dismiss();
        let alert = this.alertCtrl.create({
          title: MyApp.cardNotVerifiedText,
          buttons: [MyApp.okayText]
        });
        alert.present();
        return false;
      }
    );
  }


  openHome(){
    this.navCtrl.getByIndex(0);
    this.navCtrl.parent.select(0);
  }
  openCardPage(){
    window.document
    .querySelector("body")
    .classList.remove("transparent-body");
    this.isCameraOpen =false;
    this.qrScanner.destroy();
  }
  openScanPage(){
    this.navCtrl.push(ScanqrPage);

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
            this.navCtrl.getByIndex(0);
            this.navCtrl.parent.select(0);          }
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
