import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';



@Injectable()

export class AuthService {
    BASE_URL = environment.apiUrl; //'http://localhost:3000/api/admin'; //'https://connectedsystemsapiengine.azurewebsites.net/api/admin';
    ID_KEY = 'client-id';
    TOKEN_KEY = 'client-token';

    constructor(private http: HttpClient, private router: Router){}

    get id(){
        return localStorage.getItem(this.ID_KEY);
    }

    get isAuthenticated(){
        return !!localStorage.getItem(this.TOKEN_KEY);
    }

    get tokenHeader(){
        return new HttpHeaders({'Authorization': localStorage.getItem(this.TOKEN_KEY)}); 
    }

    register(user){
        delete user.confirmPassword;
        this.http.post(this.BASE_URL + '/signup', user).subscribe( res => {
            this.authenticate(res)
        });
    }
    
    login(loginData){
        return this.http.post(this.BASE_URL + '/signin', loginData)
    }

    logout(clientId){
        console.log('AuthService')
        this.http.get(this.BASE_URL + "/" + clientId + "/signout/", {headers: this.tokenHeader}).subscribe(res => {
            console.log('res: ', res)
        })
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.ID_KEY);
        this.router.navigate(['/']);
        
    }

    getDayReports(clientId, emmId, start, finish){
        return
    }

    authenticate(res){
        var authResponse = res;
        console.log('authResponse: ', authResponse)

        
        //not received token
        if(!authResponse['token']){
            return;
        }
        //received token
        localStorage.setItem(this.TOKEN_KEY, authResponse['token']);
        localStorage.setItem(this.ID_KEY, authResponse['client']._id);
        this.router.navigate(['/client/'+ authResponse['client']._id + '/emms']);
    }
}