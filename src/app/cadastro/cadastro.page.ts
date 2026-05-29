import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class CadastroPage implements OnInit {
  email: string = '';
  senha: string = '';
  senha2: string = '';

  ufSelecionadaId: string = '';      // ID do estado (para buscar cidades no IBGE)
  ufSelecionadaSigla: string = '';   // Sigla do estado (para salvar no backend)
  cidadeSelecionada: string = '';

  ufs: any[] = [];
  cidades: any[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.carregarEstados();
  }

  // Carrega todos os estados pelo IBGE e ordena por nome
  carregarEstados() {
    this.http.get<any[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .subscribe(data => {
        this.ufs = data.sort((a, b) => a.nome.localeCompare(b.nome));
      });
  }

  // Carrega cidades do estado selecionado
  carregarCidades() {
    if (!this.ufSelecionadaId) {
      this.cidades = [];
      return;
    }

    // Encontra o estado selecionado pelo ID
    const estadoSelecionado = this.ufs.find(u => u.id == this.ufSelecionadaId);
    if (!estadoSelecionado) return;

    // Guarda a sigla para enviar ao backend
    this.ufSelecionadaSigla = estadoSelecionado.sigla;

    // Busca cidades pelo ID do estado
    this.http.get<any[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${this.ufSelecionadaId}/municipios`)
      .subscribe(data => {
        this.cidades = data.sort((a, b) => a.nome.localeCompare(b.nome));
      });
  }

  // Realiza o cadastro
  cadastrar() {
    if (!this.email || !this.senha || !this.senha2 || !this.ufSelecionadaId || !this.cidadeSelecionada) {
      alert('Preencha todos os campos!');
      return;
    }

   if (!this.email || !this.senha || !this.senha2 || !this.ufSelecionadaSigla || !this.cidadeSelecionada) {
  alert('Preencha todos os campos!');
  return;
}


    const payload = {
      email: this.email,
      senha: this.senha,
      uf: this.ufSelecionadaSigla,
      cidade: this.cidadeSelecionada
    };

   this.http.post(`${environment.apiUrl}/api/users`, payload)
      .subscribe({
        next: (res: any) => {
          alert(res.message || 'Cadastro realizado com sucesso!');
          // Salva email e cidade no localStorage (para dashboard)
          localStorage.setItem('userEmail', this.email);
          localStorage.setItem('userCidade', this.cidadeSelecionada);

          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Erro no cadastro:', err);
          alert(err.error?.message || 'Erro ao cadastrar usuário');
        }
      });
  }
}