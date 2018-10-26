import { LoginPage } from './../login/login';
import { RegistrationtwoPage } from './../registrationtwo/registrationtwo';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { MyApp } from '../../app/app.component';

/**
 * Generated class for the RegistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {

  public firstname;
  public lastname;
   removeEmptySpacesPattern = /^[a-zA-Z0-9]*$/i;
   unregisterBackButtonAction: any;

  formgroup: FormGroup;
  username: AbstractControl;
  password: AbstractControl;
  constructor(public platform:Platform,public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController,public alertCtrl:AlertController,public formbuilder: FormBuilder) {
    this.formgroup = formbuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)]]



    });

    this.username = this.formgroup.controls['username'];

    this.password = this.formgroup.controls['password'];


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');


  }
  openRegistration2() {

    if (this.formgroup.valid) {
      console.log(this.firstname, this.lastname);

      this.navCtrl.push(RegistrationtwoPage, { firstname: this.firstname, lastname: this.lastname });
    }
    else
    {
      let alert = this.alertCtrl.create({
        title:MyApp.fieldEmptyText,
        buttons:[MyApp.okayText]
      });
      alert.present();
    }


  }

  openLogin(){

    this.navCtrl.setRoot(LoginPage);
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
    this.navCtrl.pop()
    }
  }



