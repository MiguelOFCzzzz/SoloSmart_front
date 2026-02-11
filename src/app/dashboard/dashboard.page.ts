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



  userEmail = '';
  userCidade = '';
  userUf = '';

  umidade: number = 0;
  ultimaAtualizacao: string = '';
  clima: any = {
    'Pompeia': { lat: -21.7495, lon: -50.3342 },
    'São Paulo': { lat: -23.5505, lon: -46.6333 },
    // outras cidades
  };

  lat: number = -21.7495;   // Pomps
  lon: number = -50.3342;

  private sensorApiUrl = 'http://10.17.21.143:3000/api/sensor';
  private climaApiUrl = 'http://10.17.21.143:3000/api/clima';
  private subscription!: Subscription;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userEmail = localStorage.getItem('userEmail') || '';
    this.userCidade = localStorage.getItem('userCidade') || '';
    this.userUf = localStorage.getItem('userUf') || '';
  }

  logout() {
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }

  getColor(umidade: number): string {
    if (umidade < 40) return "success";   // vermelho
    if (umidade > 40) return "warning";  // verde
    return "tertiary";                   // azul/roxo
  }

  ngOnInit() {
    // 🔄 Atualiza a cada 5 segundos os dados do sensor
    this.subscription = interval(5000)
      .pipe(switchMap(() => this.http.get<any>(this.sensorApiUrl)))
      .subscribe({
        next: (res) => {
          if (res?.recebido) {
            this.umidade = res.recebido.umidade;
            this.ultimaAtualizacao = new Date().toLocaleTimeString();
          }
        },
        error: (err) => console.error('Erro ao buscar dados do sensor:', err)
      });

    // 🔹 Busca clima ao iniciar a página
    this.buscarClima();
  }

  buscarClima() {
    if (!this.lat || !this.lon) {
      console.error('Latitude e longitude não informadas!');
      return;
    }

    const url = `${this.climaApiUrl}?lat=${this.lat}&lon=${this.lon}`;
    console.log('Chamando clima em:', url);

    this.http.get<any>(url)
      .subscribe({
        next: (res) => {
          // ⚠️ Certifique-se que a estrutura do res esteja correta
          if (res?.cidade && res?.atual) {
            this.clima = res;
            console.log('🌤️ Dados do clima carregados:', this.clima);
          } else {
            console.error('Estrutura do clima inesperada:', res);
          }
        },
        error: (err) => console.error('Erro ao buscar clima:', err)
      });
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
