import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-redefsenha',
  templateUrl: './redefsenha.page.html',
  styleUrls: ['./redefsenha.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class RedefsenhaPage {
  email = '';
  novaSenha = '';
  confirmaSenha = '';

  constructor(private http: HttpClient) {}

  redefinirSenha() {
    if (!this.email || !this.novaSenha || !this.confirmaSenha) {
      alert('Preencha todos os campos!');
      return;
    }

    if (this.novaSenha !== this.confirmaSenha) {
      alert('As senhas não conferem!');
      return;
    }

    this.http.put('http://localhost:3001/api/redefsenha', {
      email: this.email,
      novaSenha: this.novaSenha
    }).subscribe({
      next: (res: any) => {
        alert(res.message);
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Erro ao redefinir senha');
      }
    });
  }
}
