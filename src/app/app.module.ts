import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { GraphComponent } from './graph/graph.component';

import { HttpClientModule } from '@angular/common/http';
import { TrendModule } from 'ngx-trend';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GaugeChartComponent, GaugeChartModule } from 'angular-gauge-chart'
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GaugeComponent } from './gauge/gauge.component';
import { AppRoutingModule } from './/app-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    GaugeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TrendModule,
    NgxChartsModule,
    AppRoutingModule,
    GaugeChartModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
