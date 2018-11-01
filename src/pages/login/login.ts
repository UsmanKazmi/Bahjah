import { MyApp } from './../../app/app.component';
import { WorkstatusmodalPage } from './../workstatusmodal/workstatusmodal';
import { GeneralService } from './../../providers/general-service/GeneralService';
import { TabsPage } from './../tabs/tabs';
import { RegistrationPage } from './../registration/registration';
//import { MainfourPage } from './../mainfour/mainfour';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, AlertController, ModalController, Platform } from 'ionic-angular';
//import { MainthreePage } from '../mainthree/mainthree';
import { ResetpasswordPage } from '../resetpassword/resetpassword';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms'
import { HomePage } from '../home/home';
import { DeviceFeedback } from '@ionic-native/device-feedback';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  unregisterBackButtonAction: any;
  public alertShown:boolean = false;

  formgroup:FormGroup;
  username:AbstractControl;
  password:AbstractControl;


  method : string = "";
  request : string = "";
  dataList : any = "";
  myVariable: string;
  tabBarElement: any;



  constructor(public deviceFeedback: DeviceFeedback,public navCtrl: NavController, public navParams: NavParams,    public modalCtrl : ModalController, public generalService: GeneralService,public loadingCtrl: LoadingController,public alertCtrl:AlertController,public platform:Platform,
    public formbuilder: FormBuilder, public toastCtrl: ToastController, public translate: TranslateService, private storage: Storage) {
    //   let toast2= this.toastCtrl.create({
    //     //assigning the success message to toast only
    //     message: "Logged in",
    //     cssClass: 'mytoast',
    //     position:"bottom",
    //     duration: 333500
    // });
    // toast2.present(toast2);





      this.storage.ready().then(() => {
        // this.storage.clear();
        this.storage.remove('page');
        this.storage.remove('usr');
        this.storage.remove('pwd');

        this.storage.set('page','LoginPage');
        console.log("First time so show modal")
      });

      let EMAILPATTERN = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i;


        this.formgroup = formbuilder.group({
          username:['',[Validators.required, Validators.pattern(EMAILPATTERN)]],
          password:['',Validators.required]


        });

        this.username = this.formgroup.controls['username'];
        this.password = this.formgroup.controls['password'];


  }
  english(){
    this.translate.use('en'); // Set your language here
    console.log('cover to english');

  }

 openModal(){
  var modalPage = this.modalCtrl.create(WorkstatusmodalPage); modalPage.present();
  }
ionViewWillEnter(){

}



arabic(){
  this.translate.use('ar'); // Set your language here
  console.log('cover to arabic');

}
  ionViewDidLoad() {

    console.log('ionViewDidLoad LoginPage');
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    if(this.tabBarElement!=null){
      this.tabBarElement.style.display = 'none'; // or whichever property which you want to access
    }

  }
  openRegistration(){
    this.navCtrl.push(RegistrationPage);



  }


  openHomePage(){


    if (this.formgroup.valid) {

     //assigning values of method for the request
     this.method = "Login";
     // assigning values of signup form to request soap
     this.request ="<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\">"+
      "<soapenv:Header/>"+
      "<soapenv:Body>"+
      "<tem:Login>"+
      "<tem:usernameOrEmail>"+

      this.username.value+

      "</tem:usernameOrEmail>"+
      "<tem:userPassword>"+


      this.password.value+

      "</tem:userPassword>"+
      "<tem:guestToken></tem:guestToken>"+
   "</tem:Login>"+



      "</soapenv:Body>"+
     "</soapenv:Envelope>";



 // Opening a Loader when pressing Button
     let loader = this.loadingCtrl.create({
       content: MyApp.loggingInText
     });
     loader.present();




     this.generalService.webService(this.request,this.method)
     .then(response => {
         this.dataList = response;
         this.dataList = JSON.parse(this.dataList._body);
         loader.dismiss(); // disabling Loader as soon as the response is fed

         // checking for success or failure
         let alertTitle : string = "";

         //FOR CUSTOMER DOESNT EXIST ERROR
         if (this.dataList.aStatus == "CustomerNotExist") {

           this.translate.get("ERROR: Customer does not exist").subscribe(value => {
              alertTitle = value
           });
           let toast = this.toastCtrl.create({
               //assigning the success message to toast only
               message: alertTitle,

               cssClass: 'mytoast',
               duration: 3500
           });

           toast.present(toast);
         }

         //FOR wrongPasswordText ERROR

           if (this.dataList.aStatus == "WrongPassword") {

          this.translate.get("wrongPasswordText").subscribe(value => {
             alertTitle = value
          });
          let toast2= this.toastCtrl.create({
              //assigning the success message to toast only
              message: alertTitle,
              cssClass: 'mytoast',
              duration: 3500
          });

          toast2.present(toast2);
        }



          if (this.dataList.aStatus == "Success") {


            this.storage.ready().then(() => {
              this.storage.set('usr', this.username.value);
              this.storage.set('pwd',this.password.value);
              this.storage.set('page','TabsPage');
            });



          let toast = this.toastCtrl.create({
              //assigning the success message to toast only
              message: MyApp.loggedInText,
              cssClass: 'mytoast',
              duration: 1500
          });

          toast.present(toast);

          setTimeout( () => {
            this.navCtrl.setRoot(TabsPage);
            this.openModal();

          }, 1000);


        }

    });
     }
     else  //for Shwoing Alert if Fields are empty
     {
       let alert = this.alertCtrl.create({
         title:MyApp.fieldEmptyText,
         buttons:['OK']
       });
       alert.present();
     }





  }
  openResetPassword(){

    // this.navCtrl.setRoot(ResetpasswordPage);
    this.navCtrl.push(ResetpasswordPage);


  }


  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
}


ionViewDidEnter() {
  this.initializeBackButtonCustomHandler();
}
public initializeBackButtonCustomHandler(): void {
  this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
      this.customHandleBackButton();
  }, 10);
}
private customHandleBackButton(): void {

      if (this.alertShown==false) {
        this.presentConfirm();
      }
}

presentConfirm() {
  let alert = this.alertCtrl.create({
    title: MyApp.alertExitTitle,
    message: MyApp.alertMessageText,
    buttons: [
      {
        text: MyApp.alertCancelText,
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
          this.alertShown=false;
        }
      },
      {
        text: MyApp.yesText,
        handler: () => {
          console.log('Yes clicked');
          this.platform.exitApp();
        }
      }
    ]
  });
   alert.present().then(()=>{
    this.alertShown=true;
  });

}
deviceHepticFeedback(){
  this.deviceFeedback.haptic(0);
  this.deviceFeedback.acoustic();

}

}
