import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()

export class ClientService {
    BASE_URL = 'http://localhost:3000/api/client/';
    
    constructor(
        private http: HttpClient, 
        private router: Router,
        private auth: AuthService
    ){}

    getClientDetails(clientId){
        return this.http.get(this.BASE_URL + clientId, {headers: this.auth.tokenHeader})
    }

    getEmmDetails(clientId, emmId){
        return this.http.get(this.BASE_URL + clientId + "/emm/" + emmId, {headers: this.auth.tokenHeader})
    }

    getCircuitDetails(clientId, emmId, circuitId){
        return this.http.get(this.BASE_URL + clientId + "/emm/" + emmId + "/ct/" + circuitId, {headers: this.auth.tokenHeader})
    }

    getTelemetry(clientId, emmId, start, finish){
        return this.http.get(this.BASE_URL + clientId + "/emm/" + emmId + '/getTelemetry/' + start + "/" + finish, {headers: this.auth.tokenHeader})
    }

    getFiveMinReports(clientId, emmId, start, finish){
        return this.http.get(this.BASE_URL + clientId + "/emm/" + emmId + '/getFiveMin/' + start + "/" + finish, {headers: this.auth.tokenHeader})
    }

    getHourReports(clientId, emmId, start, finish){
        return this.http.get(this.BASE_URL + clientId + "/emm/" + emmId + '/getHour/' + start + "/" + finish, {headers: this.auth.tokenHeader})
    }

    getDayReports(clientId, emmId, start, finish){
        return this.http.get(this.BASE_URL + clientId + "/emm/" + emmId + '/getDay/' + start + "/" + finish, {headers: this.auth.tokenHeader})
    }

    updateClientContactDetails(clientId, clientData){
        return this.http.post(this.BASE_URL + clientId + '/contactDetails', clientData, {headers: this.auth.tokenHeader}).subscribe( res => {
            let url = "/client/" + clientId + "/update";
            this.router.navigate([url]);
        });
    }

    updateClientAddress(clientId, clientData){
        return this.http.post(this.BASE_URL + clientId + '/address', clientData, {headers: this.auth.tokenHeader}).subscribe( res => {
            let url = "/client/" + clientId + "/update";
            this.router.navigate([url]);
        });
    }

    updateClientSiteDetails(clientId, clientData){
        return this.http.post(this.BASE_URL + clientId + '/siteDetails', clientData, {headers: this.auth.tokenHeader}).subscribe( res => {
            let url = "/client/" + clientId + "/update";
            this.router.navigate([url]);
        });
    }

    updateEmm(clientId, emmId, emmData){
        return this.http.post(this.BASE_URL +  clientId + '/emm/'+ emmId + '/updateEmm ', emmData, {headers: this.auth.tokenHeader}).subscribe( res => {
            console.log('EMM Update');
            let url = '/client/' + clientId + '/emm/'+ emmId + '/settings';
            this.router.navigate([url]);
        });
    }

    getLimits(clientId, emmId, mainsCircuitId){
        return this.http.get(this.BASE_URL + clientId + "/emm/" + emmId + '/ct/' + mainsCircuitId + '/getLimits', {headers: this.auth.tokenHeader})
    }

    addLimit(clientId, emmId, circuitId, limitData){
        return this.http.post(this.BASE_URL + clientId + '/emm/'+ emmId + '/ct/'+ circuitId +'/limit/create', limitData, {headers: this.auth.tokenHeader})
    }

    updateLimit(clientId, emmId, circuitId, limitId, limitData){
        return this.http.post(this.BASE_URL + clientId + '/emm/'+ emmId + '/ct/'+ circuitId +'/limit/' + limitId, limitData, {headers: this.auth.tokenHeader})
    }

}