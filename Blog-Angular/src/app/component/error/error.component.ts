import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ba-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  public page_title: string;

  constructor() {
    this.page_title = 'Error 404';
  }

  ngOnInit(): void {
  }

}
