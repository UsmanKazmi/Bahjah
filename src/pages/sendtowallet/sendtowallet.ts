import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SendtowalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-sendtowallet',
  templateUrl: 'sendtowallet.html',
})
export class SendtowalletPage {
  dataFromPaypage: any= [];
  

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.dataFromPaypage = navParams.get("item");
    console.log("dataFromBuyCardConfirmPage",this.dataFromPaypage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendtowalletPage');
  }

}
