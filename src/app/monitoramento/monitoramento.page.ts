import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-monitoramento',
  templateUrl: './monitoramento.page.html',
  styleUrls: ['./monitoramento.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MonitoramentoPage implements OnInit {
  // private readonly BASE_URL = 'http://10.129.152.143:3000/api';
  private readonly BASE_URL = 'http://localhost:3000/api';
  
  // Instâncias dos gráficos para podermos destruir/atualizar
  charts: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.carregarDadosEGerarGraficos();
  }

  carregarDadosEGerarGraficos() {
    this.http.get<any[]>(`${this.BASE_URL}/dispositivo/historico`).subscribe({
      next: (dados) => {
        // Pegamos os últimos 10 registros para o gráfico de linha não ficar poluído
        const ultimosRegistros = dados.slice(-10);
        
        this.renderizarGraficoLinha(ultimosRegistros);
        this.renderizarGraficoPizza(dados); // Pizza usa o histórico todo
        this.renderizarGraficoBarras(dados);
      },
      error: (err) => console.error('Erro ao carregar histórico para gráficos:', err)
    });
  }

renderizarGraficoLinha(dados: any[]) {
    const ultimosDados = dados.slice(-10);

    const labels = ultimosDados.map(d => {
      const dataBruta = d.data_leitura || d.createdAt || d.data;
      const dataObj = new Date(dataBruta);
      if (isNaN(dataObj.getTime())) return '??:??';
      return dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    });

    const valores = ultimosDados.map(d => d.umidade);

    // ✅ NOME CORRIGIDO AQUI
    new Chart('chartUmidadeLinha', { 
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Umidade do Solo (%)',
          data: valores,
          borderColor: '#2A3D1D',
          backgroundColor: 'rgba(42, 61, 29, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: this.getOptions('Histórico de Umidade')
    });
  }

  renderizarGraficoBarras(dados: any[]) {
    // ✅ NOME CORRIGIDO AQUI
    new Chart('chartUmidadeBarras', {
      type: 'bar',
      data: {
        labels: ['Manhã', 'Tarde', 'Noite'],
        datasets: [{
          label: 'Média de Umidade (%)',
          data: [30, 45, 38], // Dados de exemplo para as médias
          backgroundColor: '#E3A330'
        }]
      },
      options: this.getOptions('Média por Período')
    });
  }

  renderizarGraficoPizza(dados: any[]) {
    const seco = dados.filter(d => d.umidade <= 20).length;
    const ideal = dados.filter(d => d.umidade > 20 && d.umidade <= 70).length;
    const umido = dados.filter(d => d.umidade > 70).length;

    // ✅ NOME CORRIGIDO AQUI (O QUE ESTAVA CAUSANDO O CARD VAZIO)
    new Chart('chartUmidadePizza', { 
      type: 'doughnut',
      data: {
        labels: ['Seco', 'Ideal', 'Úmido'],
        datasets: [{
          data: [seco, ideal, umido],
          backgroundColor: ['#C56D47', '#2A3D1D', '#3880ff']
        }]
      },
      options: {
        plugins: {
          legend: { labels: { color: '#2A3D1D', font: { family: 'Poppins' } } }
        }
      }
    });
  }
  getOptions(titulo: string) {
    return {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#2A3D1D' } }
      },
      scales: {
        y: { beginAtZero: true, grid: { display: false } },
        x: { grid: { display: false } }
      }
    };
  }
}