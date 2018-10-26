import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the QrmodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-qrmodal',
  templateUrl: 'qrmodal.html',
})
export class QrmodalPage {



  createdCode=null;
  qrData: any;
  productName: any;
  GiftCardCouponCode: any;

  constructor(public viewCtrl: ViewController ,public navCtrl: NavController, public navParams: NavParams) {
    console.log(navParams.get('data'));
    this.qrData= navParams.get('data');
    this.productName = this.qrData.aProductName;
    this.GiftCardCouponCode= this.qrData.aGiftCardCouponCode;
    this.createdCode = this.GiftCardCouponCode;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrmodalPage');
  }
  closeModal(){
    this.viewCtrl.dismiss();

  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  

}
