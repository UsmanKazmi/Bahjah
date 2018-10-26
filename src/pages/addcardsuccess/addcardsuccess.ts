import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AddcardsuccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-addcardsuccess',
  templateUrl: 'addcardsuccess.html',
})
export class AddcardsuccessPage {
  dataFromAddSerialPage: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
     this.dataFromAddSerialPage = this.navParams.get('item');
    console.log()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddcardsuccessPage');
  }
  removezero(item) {
    let itemToConvert =  item.aAmount.toString();
    let newValue = itemToConvert.split('.')[0];
    return newValue;
    }

}
