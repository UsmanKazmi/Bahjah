import { Component } from '@angular/core';
import {  NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the WorkstatusmodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-workstatusmodal',
  templateUrl: 'workstatusmodal.html',
})
export class WorkstatusmodalPage {

  constructor(public viewCtrl: ViewController ,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WorkstatusmodalPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  closeModal(){
    this.navCtrl.pop();

  }

}
