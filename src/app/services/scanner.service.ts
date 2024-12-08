import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  //VARIABLES
  //INDICA SI SE ESTÁ O NO ESCANEANDO
  scan : boolean = false
  scanResult : any = ""

  constructor() { }

  //FUNCION 1: PERMISO PARA ABRIR LA CAMARA
  async CheckPermission() {
    try
    {
      const status = await BarcodeScanner.checkPermission({force:true});
      if(status.granted) {
        return true;
      }

      return false;
    }
    catch(e)
    {
      return undefined;
    }
  }

  //FUNCION 2:
  async StartScan() {

    if(!this.scan) {
      this.scan = true;
      try
      {
        const permission = await this.CheckPermission();
        if(!permission) {
          alert("No hay permisos de camara. Activelos manualmente en información de la aplicación")
          this.scan = false
          this.scanResult = "Error, No hay permisos"
        }else{
          await BarcodeScanner.hideBackground();
          document.querySelector('body')?.classList.add('scanner-active');
          const result = await BarcodeScanner.startScan();
          console.log("Resueltado del escaneo: ", result) //vemos resultado
          BarcodeScanner.showBackground();
          document.querySelector('body')?.classList.remove('scanner-active');
          this.scan = false;
          if(result?.hasContent) {
            this.scanResult = result.content;
          }
        }
      }
    catch(e)
    {
        console.log(e);
    }
  } else {
    this.StopScan();
  }
}

StopScan() {
  BarcodeScanner.showBackground();
  BarcodeScanner.stopScan();
  document.querySelector('body')?.classList.remove('scanner-active');
  this.scan = false;
  this.scanResult = "Stop Scan"
}



}
