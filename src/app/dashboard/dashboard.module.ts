import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

// ADICIONE ESTA LINHA ABAIXO (O import que estava faltando)
import { DashboardPageRoutingModule } from './dashboard-routing.module'; 

import { DashboardPage } from './dashboard.page';

@NgModule({
  declarations: [DashboardPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule // Agora o Angular vai encontrar o nome corretamente!
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardPageModule {}