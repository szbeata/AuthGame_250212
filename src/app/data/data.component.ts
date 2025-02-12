import { Component } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrl: './data.component.css'
})
export class DataComponent {

  humans:any
  owner:any
  constructor(private base:BaseService) {

  }

  signUpPHP(){
    this.base.signUpPHP()
  }

  signInPHP(){
    this.base.signInPHP()
  }

  signIn(){
    this.base.googleAuth()
  }

  signOut(){
    this.base.signOut()
  }

  getHumans(){
    this.base.getHumans().subscribe(
      (data)=>this.humans=data
    )
  }

  getOwner(){
    this.base.getCarOwner().subscribe(
      (data)=>this.owner=data
    )
  }

}
