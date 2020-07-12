import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public page_title: string;

  constructor() {
    this.page_title = 'Panel de Usuario';
  }

  ngOnInit(): void {
  }

}
