import { SelectedcardPage } from './../selectedcard/selectedcard';
import { HomePage } from './../home/home';
import { Component, ViewChild } from '@angular/core';
import {  NavController, NavParams, ViewController } from 'ionic-angular';
import { Content } from 'ionic-angular';



/**
 * Generated class for the WorkstatusmodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-gridmodal',
  templateUrl: 'gridmodal.html'
})
export class GridmodalPage {
  @ViewChild(Content) content: Content;
  data : any = [];
  dataResponse: any;

  constructor(public viewCtrl: ViewController ,public navCtrl: NavController, public navParams: NavParams) {
    this.dataResponse = navParams.get('categories');
    // this.data = this.data.aWebServiceCategory;

    if (this.dataResponse.aWebServiceCategory) {

      if (this.dataResponse.aWebServiceCategory.length > 0) {
        this.data = this.dataResponse.aWebServiceCategory;
      } else {
        this.data['0'] = this.dataResponse.aWebServiceCategory;
      }
    } else {
      this.data = null;
    }

  }


  dismiss() {
    this.viewCtrl.dismiss();
  }
  closeModal(){
    this.viewCtrl.dismiss();
  }
  openProdWithCategory(event ,items){

    this.viewCtrl.dismiss(items);

  }

}
