import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { NavController } from 'ionic-angular';
import { WalletPage } from './../wallet/wallet';
import { AddcardPage } from './../addcard/addcard';
import { AccountsPage } from './../accounts/accounts';
import { SearchPage } from './../search/search';
import { Component } from '@angular/core';

import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

   tab1Root = HomePage;
   tab2Root = SearchPage;
   tab3Root = AddcardPage;
   tab4Root = WalletPage;
   tab5Root = AccountsPage;
   loaded:   boolean = false;
    static tabIndex: number  = 0;
  constructor(public navCtrl: NavController,
    private nativePageTransitions: NativePageTransitions) {

  }

  private getAnimationDirection(index:number):string {
    var currentIndex = TabsPage.tabIndex;

    TabsPage.tabIndex = index;

    switch (true){
      case (currentIndex < index):
        return('up');
      case (currentIndex > index):
        return('down');
    }
  }

  public transition(e:any):void {
    let options: NativeTransitionOptions = {
     direction:this.getAnimationDirection(e.index),
     duration: 0.2,
     slowdownfactor: -1,
     slidePixels: 0,
     iosdelay: 20,
     androiddelay: 50,
     fixedPixelsTop: 0,
     fixedPixelsBottom: 48
    };

    if (!this.loaded) {
      this.loaded = true;
      return;
    }

    this.nativePageTransitions.slide(options);
  }
}
