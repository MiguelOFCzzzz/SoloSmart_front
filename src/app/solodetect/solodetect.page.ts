import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, LoadingController, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-solodetect',
  templateUrl: './solodetect.page.html',
  styleUrls: ['./solodetect.page.scss'],
  standalone: false,
})
export class SolodetectPage {
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  // --- CONTROLE DE NAVEGAÇÃO ---
  abaAtiva: string = 'analise';
  listaHistorico: any[] = [];

  // --- VARIÁVEIS DE ANÁLISE ---
  arquivoSelecionado: File | null = null;
  resultadosIA: any = null;
  carregando: boolean = false;
  imagemComCaixas: string | null = null; 
  enviandoEmail: boolean = false;

  // --- VARIÁVEIS DO CHAT ---
  perguntaUsuario: string = '';
  digitandoIA: boolean = false;
  chatHistorico: any[] = [
    { tipo: 'bot', texto: '<b>Olá! Sou o SoloBot.</b><br>Como posso ajudar com sua plantação hoje? 🌱' }
  ];

  // Endereço da sua API Python
  private readonly API_URL = 'http://127.0.0.1:8000';

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  // --- LÓGICA DE ABAS E HISTÓRICO ---

  mudarAba(nomeAba: string) {
    this.abaAtiva = nomeAba;
    if (nomeAba === 'historico') {
      this.carregarHistorico();
    }
  }

  carregarHistorico() {
    this.http.get(`${this.API_URL}/historico`).subscribe({
      next: (res: any) => {
        this.listaHistorico = res;
      },
      error: (err) => console.error("Erro ao buscar histórico", err)
    });
  }

  async confirmarExclusao(id: number) {
    const alert = await this.alertController.create({
      header: 'Excluir Análise',
      message: 'Deseja remover este registro permanentemente?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          handler: () => { this.deletarDoBanco(id); }
        }
      ]
    });
    await alert.present();
  }

  deletarDoBanco(id: number) {
    this.http.delete(`${this.API_URL}/excluir-analise/${id}`).subscribe({
      next: () => {
        this.listaHistorico = this.listaHistorico.filter(item => item.id !== id);
      },
      error: (err) => console.error('Erro ao excluir', err)
    });
  }

  // --- LÓGICA DE ANÁLISE ---

  onFileSelected(event: any) {
    this.arquivoSelecionado = event.target.files[0];
    this.resultadosIA = null;
    this.imagemComCaixas = null;
  }

  enviarParaAnalise() {
    if (!this.arquivoSelecionado) return;

    this.carregando = true;
    const formData = new FormData();
    formData.append('file', this.arquivoSelecionado);

    this.http.post(`${this.API_URL}/analisar`, formData).subscribe({
      next: (resposta: any) => {
        this.resultadosIA = resposta;
        if (resposta.imagem_processada) {
          this.imagemComCaixas = 'data:image/jpeg;base64,' + resposta.imagem_processada;
        }
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro na API:', erro);
        this.carregando = false;
        this.exibirAlerta('Erro', 'Verifique se o servidor Python está rodando.');
      }
    });
  }

  async enviarRelatorioEmail() {
    if (!this.resultadosIA) return;
    
    this.enviandoEmail = true;
    const payload = {
      email_destino: "arthur.marques200911@gmail.com",
      deteccoes: this.resultadosIA.resultados,
      imagem_base64: this.imagemComCaixas
    };

    this.http.post(`${this.API_URL}/enviar-relatorio`, payload).subscribe({
      next: (resposta: any) => {
        this.exibirAlerta('Sucesso', 'Relatório enviado por e-mail!');
        this.enviandoEmail = false;
      },
      error: (erro) => {
        this.enviandoEmail = false;
        this.exibirAlerta('Erro', 'Falha ao enviar e-mail.');
      }
    });
  }

  // --- LÓGICA DO CHAT ---

  enviarPergunta() {
    if (!this.perguntaUsuario.trim()) return;

    const msgTexto = this.perguntaUsuario;
    this.chatHistorico.push({ tipo: 'user', texto: msgTexto });
    this.perguntaUsuario = '';
    this.digitandoIA = true;
    this.rolarParaBaixo();

    let contextoAtual = "";
    if (this.resultadosIA && this.resultadosIA.total > 0) {
      const doencas = this.resultadosIA.resultados.map((r: any) => r.doenca).join(", ");
      contextoAtual = `O aplicativo detectou: ${doencas}.`;
    }

    this.http.post(`${this.API_URL}/chat`, { mensagem: msgTexto, contexto: contextoAtual }).subscribe({
      next: (res: any) => {
        this.chatHistorico.push({ tipo: 'bot', texto: res.resposta });
        this.digitandoIA = false;
        this.rolarParaBaixo();
      },
      error: (err) => {
        this.chatHistorico.push({ tipo: 'bot', texto: 'SoloBot offline.' });
        this.digitandoIA = false;
      }
    });
  }

  // --- AUXILIARES ---

  async exibirAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }

  rolarParaBaixo() {
    setTimeout(() => {
      if (this.content) this.content.scrollToBottom(300);
    }, 100);
  }
}