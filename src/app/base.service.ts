import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';    //firebase autentikáció
import { GoogleAuthProvider } from '@angular/fire/auth';      //google autentikáció

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  api="https://spider-116a2-default-rtdb.europe-west1.firebasedatabase.app/humans.json"

  token:any

  constructor(private http:HttpClient, private auth:AngularFireAuth) {

    this.auth.authState.subscribe(         //autState-re fel lehet iratkozni
      //token visszaérkezik, ha a felhasználó belépett
      (user:any) => {
        if (user) {
          user.getIdToken().then(
            (token:any)=>{
              console.log("Token",token)
              this.token=token
            }
          )
        }
        //ha nincs belépve, akkor ne legyen token (ha be volt lépve és kilépett, akkor törlődjön)
        else this.token=null
      }
    )
  }
    
    getHumans(){
      return this.http.get(this.api+"?auth="+this.token)  //token bekérése a frontendnek az adatokkal együtt (amúgy ezt automatikusan kell küldenie, nem ilyen lekéréssel elküldeni)
    }

    //ez már egy tök másik API, amiből bekérünk adatot
    getCarOwner(){
      //ebben az esetben paraméterként van küldve a token
      let headers = new HttpHeaders().set("Authorization",`Bearer ${this.token}`)         //altgr + 7 = ``; a Bearer után mindenképp kell egy szóköz!; Bearer token???
      return this.http.get("https://172.16.16.148:7777/api/Tulajdonos",{headers})       //headers elküldése
    }

    googleAuth(){
      this.auth.signInWithPopup(new GoogleAuthProvider())
    //ez lenne akkor, ha automatikusan menne a token bekérése
      //let body={
      //  name:"",               //ezek nem beégetett adatok kellene, hogy legyenek, hanem változóból jöjjön
      //  password:""
      //}
   
      // this.http.post("sajat/login", body).subscribe(
      //   (res:any)=> {
      //     console.log(res)
      //     this.token=res.data.token
      //   }
      // )
    }

    //backend órán írt backend megszólítása --> a regisztráció végpontot
    signUpPHP(){
      let body={
        name:"Kiskacsa",
        email:"kiskacsa@valami.hu",
        password:"Almafa12",
        confirm_password:"Almafa12"   //ezt nem szoktuk elküldeni kétszer, ezt ellenőriznie kell a rendszernek 
      }
      this.http.post("http://localhost:8000/api/register",body).subscribe(
        {
          next: (res)=>{console.log(res)},    //nézzük meg, milyen adatot küld vissza a backend
          error: (res)=>{console.log("Hiba",res)}
        }
      )
    }

    signInPHP(){
      //itt azt kell lekezelni, hogy milyen adatot vár/validál a backend a belépéshez
      let body={
        name:"Kiskacsa",
        password:"Almafa12"
      }
      this.http.post("http://localhost:8000/api/login",body).subscribe(   //itt lehet, hogy meg kell adni azt is, hogy miben küldjük el: http://localhost:8000/api/login.json
        {
          next: (res:any)=>{
            if(res.data && res.data.token)    //ellenőrzi az adatokat, hogy van-e benne token
              this.token=res.data.token       //ha van, akkor berakja a Token-be
            console.log("Token: ",this.token)   //írja ki a token-t a console
          },    //nézzük meg, milyen adatot küld vissza a backend
          error: (res)=>{console.log("Hiba",res)}
        }
      )
    }

    //fentiek az angular beépített lehetőségei, nálunk majd a backendünk által felépített metódusokat kell meghívni
    signOut(){
      this.auth.signOut()
      this.token=null   //ez a PHP miatt, hogy a token törlésre kerüljön kijelentkezéskor, hogy ne lehessen visszaélni vele
    }
  
}
