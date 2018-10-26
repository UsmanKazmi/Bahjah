import { MyApp } from './../../app/app.component';
import { GeneralService } from './../../providers/general-service/GeneralService';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms'
import { TranslateService } from '@ngx-translate/core';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ResetpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-resetpassword',
  templateUrl: 'resetpassword.html',
})
export class ResetpasswordPage {
  unregisterBackButtonAction: any;

  formgroup:FormGroup;
  username:AbstractControl;

  method : string = "";
  request : string = "";
  dataList : any = "";
  emailSentText : string= "Email has been sent.."
  constructor(public platform:Platform,public navCtrl: NavController, public navParams: NavParams, public generalService: GeneralService,public loadingCtrl: LoadingController,public alertCtrl:AlertController,
    public formbuilder: FormBuilder, public toastCtrl: ToastController, public translateService: TranslateService) {
      let EMAILPATTERN = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i;


        this.formgroup = formbuilder.group({
          username:['',[Validators.required, Validators.pattern(EMAILPATTERN)]],


        });

        this.username = this.formgroup.controls['username'];


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');


  }
  sendResetEmail(){

    if (this.formgroup.valid) {

     //assigning values of method for the request
     this.method = "PasswordRecoverySend";
     // assigning values of signup form to request soap
     this.request ="<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\">"+
      "<soapenv:Header/>"+
      "<soapenv:Body>"+
      "<tem:PasswordRecoverySend>"+


      "<tem:email>"+
      this.username.value+
      "</tem:email>"+

      "</tem:PasswordRecoverySend>"+




      "</soapenv:Body>"+
     "</soapenv:Envelope>";



 // Opening a Loader when pressing Button
     let loader = this.loadingCtrl.create({
       content:MyApp.loadingText
     });
     loader.present();




     this.generalService.webService(this.request,this.method)
     .then(response => {
         this.dataList = response;
         this.dataList = JSON.parse(this.dataList._body);
         loader.dismiss(); // disabling Loader as soon as the response is fed

         // checking for success or failure

         //FOR CUSTOMER DOESNT EXIST ERROR
         if (this.dataList.aStatus == "Success") {


          let toast = this.toastCtrl.create({
            //assigning the Success message to toast
            message: MyApp.emailSentText,
            cssClass: 'mytoast',
            duration: 3500
          });
          toast.present(toast);

          this.navCtrl.push(LoginPage);

         }

         //FOR wrongPasswordText ERROR
         if (this.dataList.aStatus == "Error") {
          let alert = this.alertCtrl.create({
            title:MyApp.errorText,
            buttons:[MyApp.okayText]
          });
          alert.present();
         }








    });
     }
     else  //for Shwoing Alert if Fields are empty
     {
      //  let alert = this.alertCtrl.create({
      //    title:'fieldsRequiredText',
      //    buttons:['OK']
      //  });
      //  alert.present();
     }

  }

  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  ionViewDidEnter() {
    this.initializeBackButtonCustomHandler();
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
    this.navCtrl.pop();
    }

}
