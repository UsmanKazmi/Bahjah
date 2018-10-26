import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Storage } from '@ionic/storage';

//import 'rxjs/add/operator/map';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class GeneralService {


  constructor(public http: Http, private storage: Storage) {

  }


public webService(soapRequest,method) {

  let promise = new Promise((resolve, reject) => {

    let body = "method=" + method + "&body=" + soapRequest;


    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    let options = new RequestOptions({ headers: headers });
    // console.log(body);
    this.http.post('https://bahjahcards.com//translateAPI/', body, options)

      .timeout(100000)

      .toPromise()
      .then(
        res => { // Success
          resolve(res);
        },
        msg => { // Error
          reject(msg);
        }
      );
  });
  //console.log(promise) ;
  return promise;


}


public payService(data,url) {

  let promise = new Promise((resolve, reject) => {

    let body = "url=" + url + "&body=" + data;


    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    let options = new RequestOptions({ headers: headers });
    // console.log(body);
    this.http.post('http://beta.apptech.com.tr/bahjah/payment/', body, options)

      .timeout(30000)

      .toPromise()
      .then(
        res => { // Success
          resolve(res);
        },
        msg => { // Error
          reject(msg);
        }
      );
  });
  //console.log(promise) ;
  return promise;


}


// postData(credentials, type) {
//   return new Promise((resolve, reject) => {

//     this.http.post(apiUrl + type, JSON.stringify(credentials),)
//       .subscribe(res => {
//         resolve(res.json());
//       }, (err) => {
//         reject(err);
//       });
//   });


// }


}
