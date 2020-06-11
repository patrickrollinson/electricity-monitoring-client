import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'navigation',
  templateUrl: './nav.component.html'
})
export class NavComponent {
  public clientId 

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    this.clientId = auth.id;
    iconRegistry.addSvgIcon(
      'emm',
      sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/emm.svg')
    )
  }

  viewEmms() {
    this.router.navigate(['client/' + this.clientId + '/emms']);
  }

  viewProfile() {
    this.router.navigate(['client/' + this.clientId + '/profile']);
  }
  clickLogOut(){
    this.auth.logout(this.clientId)
  }
  

}