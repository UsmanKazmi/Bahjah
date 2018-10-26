import { timeout } from 'rxjs/operator/timeout';
import { LoginPage } from './../login/login';
import { HomePage } from './../home/home';
import { Component, ViewChild } from '@angular/core';
import {  NavController, NavParams,Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the TutorialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {
  @ViewChild(Slides) slides: Slides;


  constructor(public navCtrl: NavController, public navParams: NavParams, public storage:Storage) {

    this.storage.ready().then(() => {
      storage.clear();
      this.storage.set('page','TutorialPage');
    });


  }

  ionViewDidLoad() {



  }
  isBeginning(){
    if(this.slides.getActiveIndex()==3){
   document.getElementById("skipButton").className = "skipbutton-white"

}
    else{

   document.getElementById("skipButton").className = "skipbutton"

    }

  }
  slideChanged(){
  // setTimeout(() => this.slides.slideTo(2,2000),6000);
  // document.getElementById("skipButton").className = "skipbutton"

  if(this.slides.getActiveIndex()==2){

    document.getElementById("skipButton").className = "skipbutton-white"
      setTimeout(() => this.slides.slideTo(0,2000),6000);

    }

    else if(this.slides.getActiveIndex()==1){

      document.getElementById("skipButton").className = "skipbutton"
      setTimeout(() => this.slides.slideTo(2,2000),6000);
    }
    else {

    }

    }


 public slideChangedto1(){

    // document.getElementById("skipButton").className = "skipbutton"
    setTimeout(() => this.slides.slideTo(2,2000),6000);
}


  openHomePage(){

    this.navCtrl.push(HomePage);
  }

  openLoginScreen(){
    this.navCtrl.push(LoginPage ,{animate: true, direction: 'forward'});


  }



/*   setMyStyles() {
    let swiper= {
    };
    return swiper
  } */
}
