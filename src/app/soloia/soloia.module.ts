import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

// Importa o arquivo de rotas que criamos acima
import { SoloIAPageRoutingModule } from './soloia-routing.module'; 

import { SoloIAPage } from './soloia.page';

@NgModule({
  declarations: [SoloIAPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SoloIAPageRoutingModule // Conecta o roteamento específico da SoloIA
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SoloIAPageModule {}