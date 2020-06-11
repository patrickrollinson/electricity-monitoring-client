import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()

export class LoggingService {
    BASE_URL = 'http://localhost:3000/api/log'; // 'https://connectedsystemsapiengine.azurewebsites.net/api/admin'; //
    
    constructor(
        private http: HttpClient, 
        private router: Router,
        private auth: AuthService
    ){}
    postUnauthUserActivity(activity){
        console.log('activity: ', activity)
    }

    postAdminActivity(adminId, activity){
        console.log('activity: ', activity)
        //return this.http.post(this.BASE_URL + '/'+ adminId, activity, {headers: this.auth.tokenHeader})
    }

    postClientActivity(clientId, activity){
        console.log('activity: ', activity)
        //return this.http.post(this.BASE_URL + '/'+ clientId, activity, {headers: this.auth.tokenHeader})
    }
    
}