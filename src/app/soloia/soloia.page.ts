import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-soloia',
  templateUrl: './soloia.page.html',
  styleUrls: ['./soloia.page.scss'],
  standalone: false
})
export class SoloIAPage implements OnInit {

  userEmail = '';

  constructor(private router: Router) {
    this.userEmail = localStorage.getItem('userEmail') || '';
  }

  ngOnInit() {}

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}