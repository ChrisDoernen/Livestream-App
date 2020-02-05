import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material";
import { InlineSVGModule } from "ng-inline-svg";
import { AngularMaterialModule } from "../angular-material/angular-material.module";
import { ConfirmationDialogComponent } from "./components/confirmation-dialog/confirmation-dialog.component";
import { ContentComponent } from "./components/content/content.component";
import { LogoHeaderComponent } from "./components/logo-header/logo-header.component";
import { LogoComponent } from "./components/logo/logo.component";
import { SimpleVolumeMeterComponent } from "./components/simple-volume-meter/simple-volume-meter.component";
import { TitleBarComponent } from "./components/title-bar/title-bar.component";
import { AuthenticationInterceptor } from "./interceptors/authentication.interceptor";
import { ErrorInterceptor } from "./interceptors/error.interceptor";
import { HoursMinutesSecondsPipe } from "./pipes/hours-minutes-seconds.pipe";
import { AuthenticationService } from "./services/authentication/authentication.service";
import { DevicesService } from "./services/devices/devices.service";
import { VolumeMeterService } from "./services/volume-meter/volume-meter.service";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    AngularMaterialModule,
    FormsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    InlineSVGModule.forRoot()
  ],
  declarations: [
    ConfirmationDialogComponent,
    TitleBarComponent,
    LogoHeaderComponent,
    LogoComponent,
    ContentComponent,
    SimpleVolumeMeterComponent,
    HoursMinutesSecondsPipe
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    AngularMaterialModule,
    FormsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    InlineSVGModule,
    ConfirmationDialogComponent,
    TitleBarComponent,
    LogoHeaderComponent,
    LogoComponent,
    ContentComponent,
    SimpleVolumeMeterComponent,
    HoursMinutesSecondsPipe
  ],
  providers: [
    AuthenticationService,
    DevicesService,
    VolumeMeterService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
  ]
})
export class SharedModule { }