import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {TabViewModule} from "primeng/tabview";
import {ChipModule} from "primeng/chip";
import {ButtonModule} from "primeng/button";
import {InputSwitchModule} from "primeng/inputswitch";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {SliderModule} from "primeng/slider";
import {DropdownModule} from "primeng/dropdown";
import {KnobModule} from "primeng/knob";
import {HttpClientModule} from "@angular/common/http";
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {InputNumberModule} from "primeng/inputnumber";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TabViewModule,
    ChipModule,
    ButtonModule,
    InputSwitchModule,
    FormsModule,
    InputTextModule,
    SliderModule,
    DropdownModule,
    KnobModule,
    HttpClientModule,
    ProgressSpinnerModule,
    InputNumberModule,
    ToastModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
