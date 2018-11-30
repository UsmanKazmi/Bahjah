import { TabsPage } from './../tabs/tabs';
import { MyApp } from './../../app/app.component';
import { GeneralService } from './../../providers/general-service/GeneralService';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, LoadingController } from 'ionic-angular';

/**
 * Generated class for the WorkstatusmodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-filtermodal',
  templateUrl: 'filtermodal.html',
})
export class FiltermodalPage {
  dataFromFilters: any;
  filterData: any;

  constructor(public viewCtrl: ViewController ,public navCtrl: NavController, public navParams: NavParams,public generalService:GeneralService,public alertCtrl:AlertController, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FiltermodalPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  closeModal(){
    this.navCtrl.pop({animate: false});

  }
  close() {
    this.navCtrl.pop({animate: false});
  }

  closeModalFilters(filters) {
    this.viewCtrl.dismiss(filters);
  }


getProductsByFilter(filters){

  let loader = this.loadingCtrl.create({
    content: MyApp.loadingDataText
  });
  loader.present();

  let methodHome = "GetProductByFilters";
      let requestHome ='<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"> <Body> <GetProductByFilters xmlns="http://tempuri.org/"> <filters>'+filters+'</filters> <categoryId>'+16+'</categoryId> <usernameOrEmail>'+HomePage.dataFromEmail+'</usernameOrEmail> <userPassword>'+HomePage.dataFromPassword+'</userPassword> </GetProductByFilters> </Body> </Envelope>';

      this.generalService.webService(requestHome,methodHome).then(response => {

        this.dataFromFilters = response;

        this.filterData = JSON.parse(this.dataFromFilters._body);
        loader.dismiss();

        this.closeModalFilters(this.filterData);

      }, error =>{
          loader.dismiss();
          let alert = this.alertCtrl.create({
            title:MyApp.errorText,
            buttons:[MyApp.okayText]
          });
          alert.present();
        });





}


}
