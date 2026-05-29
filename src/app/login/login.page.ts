import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';

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

    this.http.post(`${environment.apiUrl}/api/login`, payload).subscribe({
   next: (res: any) => {
  localStorage.setItem('token', res.token);
  localStorage.setItem('usuarioLogado', 'true');
  localStorage.setItem('userEmail', this.email);
  localStorage.setItem('userCidade', res.user?.cidade || '');
  localStorage.setItem('userUf', res.user?.uf || '');
  alert('Login realizado com sucesso!');
  this.router.navigate(['/dashboard']);
},
      error: (err) => {
        console.error('Erro no login:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioLogado');
        localStorage.removeItem('userEmail');
        alert('Email ou senha inválidos!');
      }
    });
  }
}