import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})

export class LoginPage {

  email: string = '';
  senha: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  login() {

    if (!this.email || !this.senha) {
      alert('Preencha todos os campos!');
      return;
    }

    const payload = { email: this.email, senha: this.senha };

    this.http.post('http://localhost:3000/api/login', payload)
      .subscribe({
        next: (res: any) => {

          // ✅ AGORA salva somente se o backend respondeu OK
          localStorage.setItem('usuarioLogado', 'true');
          localStorage.setItem('userEmail', this.email);
          localStorage.setItem('token', res.token)

          alert('Login realizado com sucesso!');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Erro no login:', err);

          // ❌ Remove qualquer login antigo inválido
          localStorage.removeItem('usuarioLogado');
          localStorage.removeItem('userEmail');

          alert('Email ou senha inválidos!');
        }
      });
  }

}
