import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { StreamsService } from './services/streams-service.service';
import { SelectLanguageComponent } from './components/select-language/select-language.component';
import { StreamComponent } from './components/stream/stream.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    SelectLanguageComponent,
    StreamComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    StreamsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
