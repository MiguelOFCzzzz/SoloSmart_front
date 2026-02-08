import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
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
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MonitoramentoPage implements OnInit {

  ngOnInit() {
    this.graficoTemperatura();
    this.graficoFaixaTemperatura();
    this.graficoUmidadeSolo();
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
        scales: {
          x: {
            ticks: {
              color: '#fff3e0'
            }
          },
          y: {
            ticks: {
              color: '#fff3e0'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#fff3e0'
            }
          },
          tooltip: {
            bodyColor: '#fff3e0',
            borderColor: '#fff3e0'
          }
        }
      }
    });
  }

  graficoFaixaTemperatura() {
  new Chart('tempFaixa', {
    type: 'bar',
    data: {
      labels: [
        'Abaixo de 20°C',
        'Faixa ideal (20–30°C)',
        'Acima de 30°C'
      ],
      datasets: [{
        label: 'Ocorrências',
        data: [3, 6, 1],
        backgroundColor: ['#3076bd', '#508c53', '#a64646']
      }]
    },
    options: {
      scales: {
        x: {
          ticks: {
            color: '#fff3e0'
          }
        },
        y: {
          ticks: {
            color: '#fff3e0'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#fff3e0'
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.raw} vez(es) detectada(s)`
          },
          bodyColor: '#fff3e0',
          borderColor: '#fff3e0'
        }
      }
    }
  });
}

graficoUmidadeSolo() {
  new Chart('umidadeSolo', {
    type: 'doughnut',
    data: {
      labels: [
        'Solo muito seco',
        'Solo em condição ideal',
        'Solo muito úmido'
      ],
      datasets: [{
        data: [2, 5, 3],
        backgroundColor: ['#d21717', '#4CAF50', '#0277BD']
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: '#fff3e0'
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.raw} vez(es) detectada(s)`
          },
          bodyColor: '#fff3e0',
          borderColor: '#fff3e0'
        }
      }
    }
  });
}
}
