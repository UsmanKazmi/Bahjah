import { HomePage } from './../home/home';
import { BuycardcheckoutPage } from './../buycardcheckout/buycardcheckout';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SendtofriendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-sendtofriend',
  templateUrl: 'sendtofriend.html',
})
export class SendtofriendPage {
  dataFromPaypage: any= [];
  isAddedtoWallet: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.isAddedtoWallet=BuycardcheckoutPage.giftMessageheading;

    this.dataFromPaypage = navParams.get("item");

    console.log("dataFromPaypage",this.dataFromPaypage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendtofriendPage');
  }
  openHomePage(){
    this.navCtrl.getByIndex(0);
    this.navCtrl.parent.select(0);
  }

}
