import { HomePage } from './../home/home';
import { Storage } from '@ionic/storage';
import { LoginPage } from './../login/login';
import { LoadingController, AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { GeneralService } from '../../providers/general-service/GeneralService';
import { TranslateService } from '@ngx-translate/core';
import { MyApp } from '../../app/app.component';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the ConfirmpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-confirmpassword',
  templateUrl: 'confirmpassword.html',
})
export class ConfirmpasswordPage {

  confirmPassword: AbstractControl;

  formgroup:FormGroup;
  password:AbstractControl;
  validate_confirmpassword: any;
  chkCP: boolean = false;
  method : string = "";
  request : string = "";
  dataList : any = "";
  emailSentText : string= "Email has been sent.."
  token: string;
  email: string;
  constructor(public storage:Storage,public navCtrl: NavController, public navParams: NavParams, public generalService: GeneralService,public loadingCtrl: LoadingController,public alertCtrl:AlertController,
    public formbuilder: FormBuilder, public toastCtrl: ToastController, public translateService: TranslateService) {
      this.token=this.navParams.get('token');
      this.email=this.navParams.get('email');

        this.formgroup = formbuilder.group({
          password:        ['',[Validators.required,Validators.minLength(6)]],
          confirmPassword: ['']


        });

        this.password = this.formgroup.controls['password'];
        this.confirmPassword= this.formgroup.contains['confirmPassword'];

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad LoginPage');


  }

  sendResetEmail(){


 // Opening a Loader when pressing Button


    if (this.formgroup.valid && this.chkCP) {

     //assigning values of method for the request
     this.method = 'ChangeForgetPassword';
     // assigning values of signup form to request soap
     this.request ='<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"> <Body> <ChangeForgetPassword xmlns="http://tempuri.org/"> <token>'+this.token+'</token> <email>'+this.email+'</email> <newPassword>'+this.password.value+'</newPassword> </ChangeForgetPassword> </Body> </Envelope>';



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
            message: MyApp.success,
            cssClass: 'mytoast',
            duration: 3500
          });
          toast.present(toast);

          this.navCtrl.push(LoginPage);

         }
         //for password already used
         else if (this.dataList.aStatus == "Error" || this.dataList.aMessage == "account.changepassword.errors.passwordmatcheswithprevious") {


          let alert = this.alertCtrl.create({
            title:MyApp.passwordAlreadyUsedText,
            buttons:[MyApp.okayText]
          });
          alert.present();
         }

         //FOR wrongPasswordText ERROR
         else  {


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
       let alert = this.alertCtrl.create({
         title:MyApp.errorText,
         buttons:[MyApp.okayText]
       });
       alert.present();
     }





  }
  checkConfirmPassword(t){
    this.validate_confirmpassword = ""
    console.log(this.password , this.confirmPassword ,t, t.target.value, t.target.value)
    if(t.target.value.length != 0){
    if(t.target.value === this.password.value){
      console.log("Password matched")
      this.validate_confirmpassword = ""
      this.chkCP = true
    }else{ console.log("Password donot match")
    this.validate_confirmpassword = MyApp.passwordDontMatchText
    this.chkCP = false
  }
  }else{
    this.validate_confirmpassword = MyApp.allFieldsReqText
    this.chkCP = false
  }
  }



}

