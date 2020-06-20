import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ba-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  @Input() posts;
  @Input() identity;
  @Input() deletePost;
  @Input() url;

  constructor() { }

  ngOnInit(): void {
  }

}
