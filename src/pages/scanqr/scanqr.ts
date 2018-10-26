import { HomePage } from './../home/home';
import { AddcardsuccessPage } from './../addcardsuccess/addcardsuccess';
import { ToastController, LoadingController } from 'ionic-angular';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { AlertController, Platform, NavController, NavParams } from 'ionic-angular';
import { GeneralService } from './../../providers/general-service/GeneralService';
import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner";
import { MyApp } from '../../app/app.component';

/**
 * Generated class for the ScanqrPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-scanqr',
  templateUrl: 'scanqr.html',
})
export class ScanqrPage {
  public text: any;
  qrcode: any;
  category: any = [];
  statusText: any;
  aWebServiceAddWallet: any = [];
  password: any;
  username: any;
  unregisterBackButtonAction: any;
  isCameraOpen: boolean = false;

  constructor(public loadingCtrl: LoadingController,
    public generalService: GeneralService,
    public alertCtrl: AlertController,
    public nativePageTransitions: NativePageTransitions,
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    private qrScanner: QRScanner,
    public toastCtrl: ToastController) {
      this.username = HomePage.dataFromEmail;
      this.password = HomePage.dataFromPassword;

    this.scanSerial();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanqrPage');
  }

  scanSerial() {
    this.qrScanner.prepare().then((status: QRScannerStatus) => {
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

          this.navCtrl.setRoot(AddcardsuccessPage, {
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
        this.navCtrl.pop();
        return false;
      }
    );
  }
  ionViewDidLeave(){
    window.document
    .querySelector("body")
    .classList.remove("transparent-body");
  this.isCameraOpen = true;
  }


}
