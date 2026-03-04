import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit, OnDestroy {
  // 1. Dados do Usuário (Recuperados do LocalStorage)
  userEmail = localStorage.getItem('userEmail') || '';
  userCidade = localStorage.getItem('userCidade') || 'Pompeia';
  userUf = localStorage.getItem('userUf') || 'SP';

  // 2. Estado do Sensor
  umidade: number = 0;
  ultimaAtualizacao: string = '';
  textoAlertaSeco: string = "Nenhuma detecção";
  contagemSeco: number = 0;

  // 3. Clima e Coordenadas Dinâmicas
  clima: any = null; 
  lat: number = -21.7495; // Valor padrão (Pompeia)
  lon: number = -50.3342; // Valor padrão (Pompeia)

  private readonly BASE_URL = 'http://10.129.152.143:3000/api';
  private subscription!: Subscription;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.iniciarMonitoramento();
    // Primeiro descobrimos as coordenadas da cidade, depois buscamos o clima
    this.resolverLocalizacaoEClima();
  }

  /**
   * Converte o nome da cidade/estado em coordenadas reais (Geocoding)
   */
 resolverLocalizacaoEClima() {
    // Usamos a API do Open-Meteo: amigável com CORS, rápida e não bloqueia localhost
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(this.userCidade)}&count=1&language=pt&format=json`;

    this.http.get<any>(geoUrl).subscribe({
      next: (res) => {
        // O formato de resposta do Open-Meteo é um pouco diferente
        if (res.results && res.results.length > 0) {
          this.lat = parseFloat(res.results[0].latitude);
          this.lon = parseFloat(res.results[0].longitude);
          console.log(`📍 Localização definida: ${this.userCidade} (${this.lat}, ${this.lon})`);
        } else {
          console.warn(`Cidade "${this.userCidade}" não encontrada, usando padrão Pompeia.`);
        }
        
        // Independente de achar ou não, busca o clima
        this.buscarClima();
      },
      error: (err) => {
        console.error('Erro ao geolocalizar cidade, usando padrão Pompeia.', err);
        this.buscarClima();
      }
    });
  }

  buscarClima() {
    const url = `${this.BASE_URL}/clima?lat=${this.lat}&lon=${this.lon}`;
    this.http.get<any>(url).subscribe({
      next: (res) => this.clima = res,
      error: (err) => console.error('Erro ao buscar clima:', err)
    });
  }

  iniciarMonitoramento() {
    this.subscription = interval(5000)
      .pipe(
        switchMap(() => this.http.get<any[]>(`${this.BASE_URL}/dispositivo/historico`))
      )
      .subscribe({
        next: (historico) => {
          if (historico && historico.length > 0) {
            const ultimoDado = historico[historico.length - 1];
            this.umidade = ultimoDado.umidade;
            this.ultimaAtualizacao = new Date().toLocaleTimeString();
            this.processarAlertas(historico);
          }
        },
        error: (err) => console.error('Erro na API SoloSmart:', err)
      });
  }

  processarAlertas(dados: any[]) {
    const secos = dados.filter(d => d.umidade < 20).length;
    this.contagemSeco = secos;
    
    if (secos === 0) {
      this.textoAlertaSeco = "Nenhuma detecção";
    } else if (secos === 1) {
      this.textoAlertaSeco = "Uma vez detectada";
    } else {
      this.textoAlertaSeco = `${secos} vezes detectadas`;
    }
  }

  // Métodos de estilo para o HTML
  getUmidadeColor() {
    if (this.umidade <= 20) return '#C56D47'; 
    if (this.umidade > 70) return '#3880ff';  
    return '#2A3D1D';
  }

  getUmidadeStatusClass() {
    if (this.umidade <= 20) return 'status-seco';
    if (this.umidade > 70) return 'status-umido';
    return 'status-ideal';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}