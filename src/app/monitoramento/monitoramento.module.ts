import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MonitoramentoPageRoutingModule } from './monitoramento-routing.module';
import { MonitoramentoPage } from './monitoramento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MonitoramentoPageRoutingModule,
    MonitoramentoPage
  ],
  // MonitoramentoPage is a standalone component; do not declare it in an NgModule
})
export class MonitoramentoPageModule {}
