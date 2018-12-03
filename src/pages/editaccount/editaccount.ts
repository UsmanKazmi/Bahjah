import { ChangepasswordPage } from './../changepassword/changepassword';
import { HomePage } from './../home/home';
import { AccountsPage } from './../accounts/accounts';
import { GeneralService } from "./../../providers/general-service/GeneralService";
import { TranslateService } from "@ngx-translate/core";
import {
  FormGroup,
  FormBuilder,
  AbstractControl,
  Validators
} from "@angular/forms";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  LoadingController,
  ModalController,
  PopoverController,
  AlertController
} from "ionic-angular";
import { MyApp } from '../../app/app.component';

/**
 * Generated class for the EditaccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-editaccount",
  templateUrl: "editaccount.html"
})
export class EditaccountPage {
  formgroup: FormGroup;
  firstname: AbstractControl;
  lastname: AbstractControl;
  email: AbstractControl;
  password: AbstractControl;
  number: AbstractControl;
  img: any;
  dataArray = [];
  dataFromFirstName: any = [];
  dataFromLastName: any = [];
  dataFromPhoneNumber: any = [];
  dataFromEmail: any = [];
  dataFromPassword: any = [];
  dataFromCustId: any = [];


  method: string = "";
  request: string = "";
  dataList: any = "";
  value:any;


  FirstName:any="";
  LastName: any= "";
  PhoneNumber: any= "";
  Email: any= "";
  Password: any= "";
  city: any= "";
  DOB: any= "";
  gender: any= "";
  custId: any= "";
  dataFromGetCustomerInfo: any= [];

  constructor(
    public formbuilder: FormBuilder,
    public toastCtrl: ToastController,
    public translate: TranslateService,
    public loadingCtrl: LoadingController,
    public generalService: GeneralService,
    public popoverCtrl: PopoverController,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams:NavParams,
    public alertCtrl:AlertController

  ) {
    // this.dataFromFirstName = HomePage.dataFromFirstName;
    // this.dataFromLastName = HomePage.dataFromLastName;
    // this.dataFromPhoneNumber = HomePage.dataFromPhoneNumber;
    //  this.dataFromEmail = HomePage.dataFromEmail;
    //  this.dataFromPassword = HomePage.dataFromPassword;
    this.dataFromCustId = HomePage.dataFromCustId;

    this.value = navParams.get('jsonData');
    console.log(this.value);

    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    let removeEmptySpacesPattern = /^[a-zA-Z0-9]*$/i;
    let arabicnumbers =/^[\u0660-\u0669]{10}$/;
    var reg = new RegExp(/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/);




    this.formgroup = formbuilder.group({
      firstname: [
        "",
        [Validators.required, Validators.pattern(removeEmptySpacesPattern)]
      ],
      lastname: [
        "",
        [Validators.required, Validators.pattern(removeEmptySpacesPattern)]
      ],
      email: ["", [Validators.required, Validators.pattern(EMAILPATTERN)]],
      // password: ["", Validators.required],
      number: ["", [Validators.required, Validators.pattern(reg)]],
    });

    this.firstname = this.formgroup.controls["firstname"];
    this.lastname = this.formgroup.controls["lastname"];
    this.email = this.formgroup.controls["email"];
    // this.password = this.formgroup.controls["password"];
    this.number = this.formgroup.controls["number"];


    this.getCustomerInfo(HomePage.dataFromEmail,HomePage.dataFromPassword);

  }





  // Request for Update Button
  updateAccount(){
    var reg = new RegExp(/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/);
    if(reg.test(this.formgroup.value.number)==false){
      console.log(' REG not matched');

      let alert = this.alertCtrl.create({
        title: MyApp.invalidPhone,
        buttons:[MyApp.okayText]
      });
      alert.present();

    }

    else{
      console.log('REG MATCHED');
      console.log(this.formgroup)

      if(this.formgroup.status=="VALID"){


        HomePage.dataFromPhoneNumber = this.formgroup.value.number;

        console.log("Email is",this.dataFromEmail );
        console.log("cUStomerID is",this.dataFromCustId );
    
        this.method = "EditCustomerInfo";
        this.request ="<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\"> <soapenv:Header/> <soapenv:Body> <tem:EditCustomerInfo> <!--Optional:--> <tem:usernameOrEmail>"+this.dataFromEmail+"</tem:usernameOrEmail> <!--Optional:--> <tem:userPassword>"+this.dataFromPassword+"</tem:userPassword> <!--Optional:--> <tem:customerId>"+this.dataFromCustId+"</tem:customerId> <!--Optional:--> <tem:email>"+this.dataFromEmail+"</tem:email> <!--Optional:--> <tem:firstName>"+this.dataFromFirstName+"</tem:firstName> <!--Optional:--> <tem:lastName>"+this.dataFromLastName+"</tem:lastName> <!--Optional:--> <tem:CountryId>"+"0"+"</tem:CountryId> <!--Optional:--> <tem:City></tem:City> <!--Optional:--> <tem:DateofBirth></tem:DateofBirth> <!--Optional:--> <tem:Phone>"+this.dataFromPhoneNumber+"</tem:Phone> <!--Optional:--> <tem:Gender></tem:Gender> <!--Optional:--> <tem:username></tem:username> </tem:EditCustomerInfo> </soapenv:Body> </soapenv:Envelope>";
    
        let loader = this.loadingCtrl.create({
          content: MyApp.loadingDataText
        });
        loader.present();
    
        this.generalService.webService(this.request, this.method).then(
          response => {
            this.dataList = response;
            this.dataList = JSON.parse(this.dataList._body);
             console.log(response);
            loader.dismiss();
            if (this.dataList.aStatus == "Success") {
              console.log("Data has been updated");
    
    
              let toast = this.toastCtrl.create({
                //assigning the Success message to toast
                message: MyApp.successfullyUpdatedText,
                cssClass: 'mytoast',
                duration: 1500
            });
            toast.present(toast);
            this.navCtrl.setRoot(AccountsPage)
    
            } else {
            }
          },
          error => {
            console.log(error);
            alert( MyApp.errorText);
            loader.dismissAll();
    
          }
        )
    
    
      }
      else
      {
        let alert = this.alertCtrl.create({
          title: MyApp.allFieldsReqText,
          buttons:[MyApp.okayText]
        });
        alert.present();
      }



  }
 
  }

  getCustomerInfo(username, password){


    this.method = "GetCustomerInfo";

    this.request =
      '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/"> <soapenv:Header/> <soapenv:Body> <tem:GetCustomerInfo> <tem:usernameOrEmail>'+username+'</tem:usernameOrEmail> <tem:userPassword>'+password+'</tem:userPassword> </tem:GetCustomerInfo> </soapenv:Body> </soapenv:Envelope>';
        let loader = this.loadingCtrl.create({
      content: MyApp.loadingDataText
    });
    loader.present();

      this.generalService.webService(this.request, this.method).then(
        response => {
          this.dataFromGetCustomerInfo = response;
          console.log(response);
          loader.dismiss();

          if (this.dataFromGetCustomerInfo.statusText == "OK") {

            this.dataFromGetCustomerInfo = JSON.parse(this.dataFromGetCustomerInfo._body);
            console.log("dataFromGetCustomerInfo",this.dataFromGetCustomerInfo );

              this.dataFromFirstName = this.dataFromGetCustomerInfo.aFirstName;
              this.dataFromLastName = this.dataFromGetCustomerInfo.aLastName;
              console.log('asdasd',this.dataFromGetCustomerInfo.aPhone)


              if(this.dataFromGetCustomerInfo.aPhone[0]!=null && this.dataFromGetCustomerInfo.aPhone[0]==" "){
                this.dataFromPhoneNumber =' ';
               }
               else{
                this.dataFromPhoneNumber = this.dataFromGetCustomerInfo.aPhone;
               }








              this.dataFromEmail = this.dataFromGetCustomerInfo.aEmail;
              this.dataFromPassword = HomePage.dataFromPassword;
              // this.dataFromCustId = this.dataFromGetCustomerInfo.dataFromCustId;

          } else {
          }
        },
        error => {
          console.log(error);
        alert( MyApp.errorText);
        }
      );

    }
    public openChangePassword(){
      this.navCtrl.push(ChangepasswordPage);
    }

}
