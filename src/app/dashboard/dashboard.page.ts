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

  userEmail: string = '';
  userCidade: string = '';
  userUf: string = '';

  umidade: number = 0;
  ultimaAtualizacao: string = '';
  textoAlertaSeco: string = "Nenhuma detecção";
  contagemSeco: number = 0;

  clima: any = null;
  lat: number = -21.7495;
  lon: number = -50.3342;

  private readonly BASE_URL = 'http://localhost:3001/api';
  private subscription!: Subscription;

  constructor(private router: Router, private http: HttpClient) {}

  sair() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.userEmail = localStorage.getItem('userEmail') || '';
    this.userCidade = localStorage.getItem('userCidade') || 'Pompeia';
    this.userUf = localStorage.getItem('userUf') || '';
    this.clima = null;
    this.umidade = 0;

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.iniciarMonitoramento();
    this.resolverLocalizacaoEClima();
  }

  ionViewWillLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  resolverLocalizacaoEClima() {
    const cidade = this.userCidade;
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`;

    this.http.get<any>(geoUrl).subscribe({
      next: (res) => {
        if (res.results && res.results.length > 0) {
          this.lat = parseFloat(res.results[0].latitude);
          this.lon = parseFloat(res.results[0].longitude);
        } else {
          console.warn(`Cidade "${cidade}" não encontrada, usando padrão.`);
        }
        this.buscarClima();
      },
      error: (err) => {
        console.error('Erro ao geolocalizar cidade.', err);
        this.buscarClima();
      }
    });
  }

  buscarClima() {
    const token = localStorage.getItem('token');
    const url = `${this.BASE_URL}/clima?lat=${this.lat}&lon=${this.lon}`;
    this.http.get<any>(url, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => this.clima = res,
      error: (err) => console.error('Erro ao buscar clima:', err)
    });
  }

  iniciarMonitoramento() {
    const token = localStorage.getItem('token');
    this.subscription = interval(5000)
      .pipe(
        switchMap(() => this.http.get<any[]>(`${this.BASE_URL}/sensor/historico`, {
          headers: { Authorization: `Bearer ${token}` }
        }))
      )
      .subscribe({
        next: (res: any) => {
          const historico = res.historico || [];
          if (historico.length > 0) {
            const ultimoDado = historico[0];
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

  releLigado: boolean = false;

  ligarRele() {
    this.releLigado = true;
    fetch('http://localhost/ligar')
      .then(() => console.log('Relé ligado'))
      .catch(err => console.error('Erro ao ligar relé', err));
  }

  desligarRele() {
    this.releLigado = false;
    fetch('http://localhost/desligar')
      .then(() => console.log('Relé desligado'))
      .catch(err => console.error('Erro ao desligar relé', err));
  }
}