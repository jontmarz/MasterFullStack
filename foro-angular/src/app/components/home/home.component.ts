import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  page_title: string;

  constructor() {
    this.page_title = 'Bienvenido al Foro de Jon';
  }

  ngOnInit(): void {
  }
}
