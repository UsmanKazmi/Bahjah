import { HomePage } from './../home/home';
import { Storage } from '@ionic/storage';
import { LoginPage } from './../login/login';
import { TranslateService } from '@ngx-translate/core';
import { ToastController, LoadingController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GeneralService } from '../../providers/general-service/GeneralService';
import { MyApp } from '../../app/app.component';
/**
 * Generated class for the ChangepasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {

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
    oldPassword:AbstractControl;

    constructor(public storage:Storage,public navCtrl: NavController, public navParams: NavParams, public generalService: GeneralService,public loadingCtrl: LoadingController,public alertCtrl:AlertController,
      public formbuilder: FormBuilder, public toastCtrl: ToastController, public translateService: TranslateService) {


        console.log("OLD Password",this.oldPassword);






          this.formgroup = formbuilder.group({
            oldPassword:      ['',[Validators.required,Validators.minLength(6)]],
            password:        ['',[Validators.required,Validators.minLength(6)]],
            confirmPassword: ['']


          });
          this.oldPassword = this.formgroup.controls['oldPassword'];
          this.password = this.formgroup.controls['password'];
          this.confirmPassword= this.formgroup.contains['confirmPassword'];

    }

    ionViewDidLoad() {

      console.log('ionViewDidLoad LoginPage');


    }

    sendResetEmail(){
      debugger;


   // Opening a Loader when pressing Button
  if (this.formgroup.valid && this.chkCP) {

    if(this.oldPassword.value==HomePage.dataFromPassword){

       //assigning values of method for the request
       this.method = 'ChangePassword';
       // assigning values of signup form to request soap
       this.request ='<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"> <Body> <ChangePassword xmlns="http://tempuri.org/"> <usernameOrEmail>'+HomePage.dataFromEmail+'</usernameOrEmail> <userPassword>'+this.oldPassword.value+'</userPassword> <userNewPassword>'+this.password.value+'</userNewPassword> </ChangePassword> </Body> </Envelope>';



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
              message: MyApp.signInAgain,
              cssClass: 'mytoast',
              duration: 3500
            });
            toast.present(toast);

            this.navCtrl.setRoot(LoginPage);

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
          title:MyApp.wrongOldPassword,
          buttons:[MyApp.okayText]
        });
        alert.present();


       }


      }
      else{



        let alert = this.alertCtrl.create({
          title:MyApp.fieldEmptyText,
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


