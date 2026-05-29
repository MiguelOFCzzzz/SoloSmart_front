import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonContent } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solochat',
  templateUrl: './solochat.page.html',
  styleUrls: ['./solochat.page.scss'],
  standalone: false
})
export class SolochatPage {
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  perguntaUsuario: string = '';
  digitandoIA: boolean = false;
  chatHistorico: any[] = [
    { tipo: 'bot', texto: '<b>Olá! Sou o SoloBot.</b><br>Como posso ajudar com sua plantação hoje? 🌱' }
  ];

  private readonly API_URL = 'http://localhost:8000';

  constructor(private http: HttpClient, private router: Router) {}

  navegar(rota: string) {
    this.router.navigate([rota]);
  }

  isActive(rota: string): boolean {
    return this.router.url === rota;
  }

  enviarPergunta() {
    if (!this.perguntaUsuario.trim()) return;

    const msgTexto = this.perguntaUsuario;
    this.chatHistorico.push({ tipo: 'user', texto: msgTexto });
    this.perguntaUsuario = '';
    this.digitandoIA = true;
    this.rolarParaBaixo();

    this.http.post(`${this.API_URL}/chat`, {
      mensagem: msgTexto,
      contexto: "O usuário está na página exclusiva de chat do SoloSmart."
    }).subscribe({
      next: (res: any) => {
        this.chatHistorico.push({ tipo: 'bot', texto: res.resposta });
        this.digitandoIA = false;
        this.rolarParaBaixo();
      },
      error: (err) => {
        console.error('Erro no chat:', err);
        this.chatHistorico.push({ tipo: 'bot', texto: '<b>SoloBot:</b> Desculpe, estou com dificuldade de conexão agora.' });
        this.digitandoIA = false;
        this.rolarParaBaixo();
      }
    });
  }

  rolarParaBaixo() {
    setTimeout(() => {
      if (this.content) {
        this.content.scrollToBottom(300);
      }
    }, 100);
  }
}