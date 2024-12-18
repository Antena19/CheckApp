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

  //FUNCION 2: ESCANEO
  async StartScan(): Promise<string | undefined> {
    if (!this.scan) {
      this.scan = true;
      try {
        const permission = await this.CheckPermission();
        if (!permission) {
          alert("No hay permisos de cámara. Actívalos manualmente en la configuración de la aplicación.");
          this.scan = false;
          this.scanResult = "Error, No hay permisos";
          return undefined;
        } else {
          await BarcodeScanner.hideBackground();
          document.querySelector('body')?.classList.add('scanner-active');
          const result = await BarcodeScanner.startScan();
          BarcodeScanner.showBackground();
          document.querySelector('body')?.classList.remove('scanner-active');
          this.scan = false;
  
          if (result?.hasContent) {
            this.scanResult = result.content;
            console.log("Contenido escaneado:", this.scanResult);
  
            // Extraer ID del evento del contenido del QR
            const match = this.scanResult.match(/evento\/([a-zA-Z0-9]+)/);
            if (match && match[1]) {
              return match[1]; // Devolver el ID del evento
            } else {
              alert("El código QR escaneado no es válido.");
            }
          }
        }
      } catch (e) {
        console.log(e);
        this.scan = false;
      }
    } else {
      this.StopScan();
    }
    return undefined; // Si algo falla o no hay contenido válido
  }
  

StopScan() {
  BarcodeScanner.showBackground();
  BarcodeScanner.stopScan();
  document.querySelector('body')?.classList.remove('scanner-active');
  this.scan = false;
  this.scanResult = "Stop Scan"
}



}
