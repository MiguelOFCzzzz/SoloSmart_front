import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router'; // 1. Importação necessária para o routerLink funcionar
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-monitoramento',
  templateUrl: './monitoramento.page.html',
  styleUrls: ['./monitoramento.page.scss'],
  standalone: true,
  // 2. Adicionado RouterModule aqui para ativar a navegação entre páginas
  imports: [CommonModule, IonicModule, RouterModule], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MonitoramentoPage implements OnInit {

  ngOnInit() {
    // 3. Pequeno atraso para garantir que os elementos <canvas> já existam no HTML
    setTimeout(() => {
      this.graficoTemperatura();
      this.graficoFaixaTemperatura();
      this.graficoUmidadeSolo();
    }, 150);
  }

  graficoTemperatura() {
    new Chart('tempLinha', {
      type: 'line',
      data: {
        labels: ['10h', '12h', '14h', '16h', '18h'],
        datasets: [{
          label: 'Temperatura do Solo (°C)',
          data: [18, 21, 24, 22, 19],
          borderColor: '#7AC943',
          backgroundColor: 'rgba(122,201,67,0.2)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { ticks: { color: '#fff3e0' } },
          y: { ticks: { color: '#fff3e0' } }
        },
        plugins: {
          legend: { labels: { color: '#fff3e0' } }
        }
      }
    });
  }

  graficoFaixaTemperatura() {
    new Chart('tempFaixa', {
      type: 'bar',
      data: {
        labels: ['Abaixo de 20°C', 'Ideal (20–30°C)', 'Acima de 30°C'],
        datasets: [{
          label: 'Ocorrências',
          data: [3, 6, 1],
          backgroundColor: ['#3076bd', '#508c53', '#a64646']
        }]
      },
      options: {
        scales: {
          x: { ticks: { color: '#fff3e0' } },
          y: { ticks: { color: '#fff3e0' } }
        }
      }
    });
  }

  graficoUmidadeSolo() {
    new Chart('umidadeSolo', {
      type: 'doughnut',
      data: {
        labels: ['Seco', 'Ideal', 'Úmido'],
        datasets: [{
          data: [2, 5, 3],
          backgroundColor: ['#d21717', '#4CAF50', '#0277BD']
        }]
      },
      options: {
        plugins: {
          legend: { labels: { color: '#fff3e0' } }
        }
      }
    });
  }
}