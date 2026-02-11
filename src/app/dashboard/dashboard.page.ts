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
  
  // Estrutura de dados do clima
  clima: any = null; 

  // Coordenadas padrão (Pompeia)
  lat: number = -21.7495;
  lon: number = -50.3342;

  // 🛠️ MUDANÇA AQUI: Alterado de IP fixo para localhost para evitar o erro de Timeout
  private sensorApiUrl = 'http://localhost:3000/api/sensor';
  private climaApiUrl = 'http://localhost:3000/api/clima';
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

  // 🎨 MUDANÇA AQUI: Cores baseadas na sua identidade visual SoloSmart
  getColor(umidade: number): string {
    if (umidade < 30) return "danger";  // Muito seco (Laranja/Vermelho)
    if (umidade >= 30 && umidade <= 60) return "success"; // Ideal (Verde)
    return "primary"; // Muito úmido (Azul)
  }

  ngOnInit() {
    // 🔄 Atualiza a cada 5 segundos os dados do sensor
    this.subscription = interval(5000)
      .pipe(
        // O switchMap cancela a requisição anterior se a nova começar, evitando travar o app
        switchMap(() => this.http.get<any>(this.sensorApiUrl))
      )
      .subscribe({
        next: (res) => {
          // Ajustado para verificar a estrutura que vem do seu Node.js
          if (res && res.recebido) {
            this.umidade = res.recebido.umidade;
            this.ultimaAtualizacao = new Date().toLocaleTimeString();
          }
        },
        error: (err) => {
          console.error('Erro ao buscar dados do sensor (Verifique se o Node.js está rodando):', err);
        }
      });

    // 🔹 Busca clima ao iniciar a página
    this.buscarClima();
  }

  buscarClima() {
    const url = `${this.climaApiUrl}?lat=${this.lat}&lon=${this.lon}`;
    
    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res && res.atual) {
          this.clima = res;
          console.log('🌤️ Dados do clima carregados:', this.clima);
        }
      },
      error: (err) => console.error('Erro ao buscar clima:', err)
    });
  }

  ngOnDestroy() {
    // Importante para não deixar o intervalo rodando na memória após sair da página
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}