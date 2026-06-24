import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
if (environment.production) {
  enableProdMode();
}

export function getBaseUrl() {
/*return "http://stockmapi/";*/
 
/*  return "https://qaapi.bizman.in/";*/
// return "https://bizprodapi.bizman.in/";
//  return "https://polymechapi.bizman.in/";
  // return "https://localhost:44326/";
  //  return "https://localhost:44326/";
    return "https://localhost:44302/";
//  return "http://vcareapi/";
}

//if (window) {
//  window.console.log = function () { };
//}                                                                                            


export function getRazKey() {
  //for test mode
/*  return "rzp_test_n2Qfgk7G6EiiZt";*/

  //for prod
 // return "rzp_live_Ij6KpJb8wXn3Mj";
}

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
  { provide: 'RAZ_KEY', useFactory: getRazKey, deps: [] }
];
platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.error(err));
