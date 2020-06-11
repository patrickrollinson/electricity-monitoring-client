import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http'

//modules
import { ChartsModule } from 'ng2-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

//Components
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';

import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { PricingComponent } from './pricing/pricing.component';
import { ContactUsComponent } from './contactUs/contactUs.component';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ClientComponent } from './client/client.component';
import { ClientProfileComponent } from './client/clientProfile/clientProfile.component';
import { ClientEmmsComponent } from './client/clientEmms/clientEmms.component';
import { UpdateClientComponent } from './client/updateClient/updateClient.component';
import { DashboardComponent } from './emm/dashboard/dashboard.component';
//limits
import { LimitsComponent } from './emm/dashboard/limits/limits.component';
import { ActiveLimitsComponent } from './emm/dashboard/limits/activeLimits/activeLimits.component';
import { CumulChartComponent } from './emm/dashboard/limits/activeLimits/cumulChart/cumulChart.component';
import { ViewLimitsComponent } from './emm/dashboard/limits/viewLimits/viewLimits.component';
import { ViewDailyLimitsComponent } from './emm/dashboard/limits/viewLimits/viewDailyLimits/viewDailyLimits.component';
import { ViewMonthlyLimitsComponent } from './emm/dashboard/limits/viewLimits/viewMonthlyLimits/viewMonthlyLimits.component';

import { EmmSettingsComponent } from './emm/dashboard/settings/emmSettings.component';
import { UpdateEmmComponent } from './emm/updateEmm/updateEmm.component';
import { LiveComponent } from './emm/dashboard/live/live.component';
import { ChartComponent } from './emm/dashboard/chart/chart.component';
import { ReportComponent } from './emm/dashboard/report/report.component';

import { CircuitsComponent } from './emm/dashboard/settings/circuits/circuits.component';
import { ViewCircuitsComponent } from './emm/dashboard/settings/circuits/viewCircuits/viewCircuits.component';

//Services
import { AuthService } from './auth.service';
import { ClientService } from './client.service';
import { LoggingService } from './logging.service';

//Angular Material
import {
  MatButtonModule,
  MatToolbarModule,
  MatMenuModule,
  MatSidenavModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatExpansionModule,
  MatGridListModule,
  MatDatepickerModule,
  MatSelectModule,
  MatTabsModule,
  MatTableModule,
  MatIconModule,
  MatRadioModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatProgressSpinnerModule
} from '@angular/material';

var routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent },
  {path: 'register', component: RegisterComponent },
  {path: 'product', component: ProductComponent },
  {path: 'pricing', component: PricingComponent },
  {path: 'contact-us', component: ContactUsComponent },
  {path: 'client/:clientId/emm/:emmId/update', component: UpdateEmmComponent },
  {path: 'client/:clientId/emm/:emmId', component: DashboardComponent },
  {path: 'client/:clientId/profile', component: ClientProfileComponent },
  {path: 'client/:clientId/update', component: UpdateClientComponent },
  {path: 'client/:clientId/emms', component: ClientEmmsComponent },
  {path: 'client/:clientId', component: ClientComponent }
];


@NgModule({
  declarations: [
    //components
    AppComponent,
    NavComponent,

    HomeComponent,
    ProductComponent,
    PricingComponent,
    ContactUsComponent,

    LoginComponent,
    RegisterComponent,
    ClientComponent,
    ClientProfileComponent,
    ClientEmmsComponent,
    UpdateClientComponent,
    DashboardComponent,
    EmmSettingsComponent,
    //limits
    LimitsComponent,
      ActiveLimitsComponent,
        CumulChartComponent,
      ViewLimitsComponent,
        ViewDailyLimitsComponent,
        ViewMonthlyLimitsComponent,

    UpdateEmmComponent,
    LiveComponent,
    ChartComponent,
    ReportComponent,
    CumulChartComponent,
    CircuitsComponent,
    ViewCircuitsComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    ChartsModule,
    //material
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatMenuModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatListModule,
    MatExpansionModule,
    MatGridListModule,
    MatSelectModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    
    Ng2GoogleChartsModule
  ],
  providers: [AuthService, ClientService, LoggingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
