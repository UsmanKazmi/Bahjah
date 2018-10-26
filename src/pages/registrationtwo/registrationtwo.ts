import { WorkstatusmodalPage } from './../workstatusmodal/workstatusmodal';
import { Storage } from '@ionic/storage';
import { MyApp } from './../../app/app.component';
import { TutorialPage } from './../tutorial/tutorial';
import { LoginPage } from './../login/login';



import { GeneralService } from './../../providers/general-service/GeneralService';

import { ResetpasswordPage } from './../resetpassword/resetpassword';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, AlertController, Platform, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import 'rxjs/add/operator/toPromise'
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/map';
import { TranslateService } from '@ngx-translate/core';
import { stringify } from '../../../node_modules/@angular/core/src/render3/util';
import { TabsPage } from '../tabs/tabs';

// import { Body } from '@angular/http/src/body';


@Component({
  selector: 'page-registrationtwo',
  templateUrl: 'registrationtwo.html',
})
export class RegistrationtwoPage {
  firstname: any;
  lastname: any;

  responseData: any;

  formgroup: FormGroup;
  username: string;
  password: AbstractControl;
  email: AbstractControl;
  validator: AbstractControl;
  confirmPassword: AbstractControl;

  unregisterBackButtonAction: any;

  method : string = "";
  request : string = "";
  dataList : any = "";
  validate_confirmpassword: any;
  chkCP: boolean = false;




  constructor(public modalCtrl:ModalController,public storage:Storage ,public platform:Platform,public navCtrl: NavController, public navParams: NavParams, public generalService: GeneralService,public loadingCtrl: LoadingController,public alertCtrl:AlertController,

    public formbuilder: FormBuilder, public toastCtrl: ToastController, public translateService: TranslateService)
  {
      this.username=this.navParams.get('firstname')+" "+this.navParams.get('lastname');

      let EMAILPATTERN = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i;

          this.formgroup = formbuilder.group({

              email:['',[Validators.required, Validators.pattern(EMAILPATTERN)]],
              // username:['',Validators.required],
              password: ['',Validators.required],
              confirmPassword: ['']})



          // this.username = this.formgroup.controls['username'];
          this.email = this.formgroup.controls['email'];
          this.password = this.formgroup.controls['password'];
          this.confirmPassword= this.formgroup.contains['confirmPassword'];

    }


    checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
      return (group: FormGroup) => {
          let passwordInput = group.controls[passwordKey],
              passwordConfirmationInput = group.controls[passwordConfirmationKey];
          if (passwordInput.value !== passwordConfirmationInput.value) {
              return passwordConfirmationInput.setErrors({notEquivalent: true})
          }
          else {
              return passwordConfirmationInput.setErrors(null);
          }
      }
    }
//validating password and confirmPasswordText (regex match case)
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

  ionViewDidLoad() {
    // do work on view did load
  }


  openResetPasswordPage() {
    this.navCtrl.push(ResetpasswordPage);
  }

  // register controller for signup service
  register() {



    //if Condition for checking if the inputs are empty or not
    if (this.formgroup.valid && this.chkCP) {

    //assigning values of method for the request
    this.method = "Register";
    // assigning values of signup form to request soap
    this.request ="<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\">"+
     "<soapenv:Header/>"+
     "<soapenv:Body>"+
        "<tem:Register>"+

           "<tem:username>"+
              this.username+
            "</tem:username>"+


           "<tem:email>"+
           this.email.value+
           "</tem:email>"+


           "<tem:password>"+
           this.password.value+
           "</tem:password>"+

           "<tem:firstName>"+
           this.navParams.get('firstname')+
           "</tem:firstName>"+


           "<tem:lastName>"+
           this.navParams.get('lastname')+
           "</tem:lastName>"+

        "</tem:Register>"+
     "</soapenv:Body>"+
    "</soapenv:Envelope>";



// Opening a Loader when pressing Button
    let loader = this.loadingCtrl.create({
      content: MyApp.loadingDataText
    });
    loader.present();




    this.generalService.webService(this.request,this.method)
    .then(response => {
        this.dataList = response;
        this.dataList = JSON.parse(this.dataList._body);
        loader.dismiss(); // disabling Loader as soon as the response is fed

        // checking for success or failure
        let alertTitle : string = "";
        if (this.dataList.aStatus != "Error") {

          // let toast = this.toastCtrl.create({
          //     //assigning the success message to toast only
          //     message: MyApp.checkEmailText,
          //     cssClass: 'mytoast',
          //     duration: 1500
          // });
          // toast.present(toast);


          this.storage.ready().then(() => {
            this.storage.remove('usr');
            this.storage.remove('pwd');
            this.storage.remove('page');
          });

          this.storage.ready().then(() => {
            this.storage.set('usr', this.email.value);
            this.storage.set('pwd',this.password.value);
            this.storage.set('page','TabsPage');
          });




        setTimeout( () => {
          this.navCtrl.setRoot(TabsPage);
          this.openModal();

        }, 1000);



        } else if(this.dataList.aMessages.bstring=="account.register.errors.emailalreadyexists") {

            let toast = this.toastCtrl.create({
                //assigning the failure message to toast
                message:  MyApp.emailAlreadyExistText,
                cssClass: 'mytoast',
                duration: 2500
            });
            toast.present(toast);
        }

        else {
            let toast = this.toastCtrl.create({
                //assigning the failure message to toast
                message: this.dataList.aMessages.bstring,
                cssClass: 'mytoast',
                duration: 2500
            });
            toast.present(toast);
        }


   });
    }
    else  //for Shwoing Alert if Fields are empty
    {

      // this.fieldsRequiredText = this.translateService.get('fieldsRequiredText');
      let alert = this.alertCtrl.create({

        title:MyApp.allFieldsReqText,
        buttons:[MyApp.okayText]
      });
      alert.present();
    }




  }


  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }
  openModal(){
    var modalPage = this.modalCtrl.create(WorkstatusmodalPage); modalPage.present();
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


