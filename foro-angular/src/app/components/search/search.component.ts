import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Topic } from '../../models/topic';
import { TopicService } from '../../services/topic.service';
import { faBookReader } from '@fortawesome/free-solid-svg-icons';
import { faStepBackward } from '@fortawesome/free-solid-svg-icons';
import { faStepForward } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search',
  templateUrl: '../topics/topics.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [TopicService],
})
export class SearchComponent implements OnInit {

  public page_title: string;
  public topics: Topic[];
  public leer = faBookReader;
  public atras = faStepBackward;
  public siguiente = faStepForward;
  public totalPages;
  public page;
  public nextPage;
  public prevPage;
  public numberPages;
  public noPaginate;

  constructor(
    private _topicService: TopicService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.page_title = 'Buscar:';
    this.noPaginate = true;
  }

  ngOnInit(): void {
    this.pages();
  }

  pages() {
    this._route.params.subscribe( params => {
      const search = params.search;
      this.page_title = `${this.page_title} ${search}`;
      this.getTopics(search);
    });
  }

  getTopics(search) {
    this._topicService.search(search).subscribe(
      response => {
        if (response.topics) {
          this.topics = response.topics;
        }
      }, error => {
        console.log(error);
      }
    );
  }
}
