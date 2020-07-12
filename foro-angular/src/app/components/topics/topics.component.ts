import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Topic } from '../../models/topic';
import { TopicService } from '../../services/topic.service';
import { faBookReader } from '@fortawesome/free-solid-svg-icons';
import { faStepBackward } from '@fortawesome/free-solid-svg-icons';
import { faStepForward } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss'],
  providers: [TopicService],
})

export class TopicsComponent implements OnInit {

  public page_title: string;
  public leer = faBookReader;
  public atras = faStepBackward;
  public siguiente = faStepForward;
  public topics: Topic[];
  public totalPages;
  public page;
  public nextPage;
  public prevPage;
  public numberPages;

  constructor(
    private _topicService: TopicService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.page_title = 'Temas';
  }

  ngOnInit(): void {
    this.pages();
  }

  getTopics(page = 1){
    this._topicService.getTopics(page).subscribe(
      response => {
        if (response.topics) {
          this.topics = response.topics;

          // navegación paginación
          this.totalPages = response.totalPages;
          // console.log(this.totalPages);
          var number_pages = [];

          for (let i = 1; i <= this.totalPages; i++) {
            number_pages.push(i);
          }

          this.numberPages = number_pages;

          // numero de páginas
          if (page >= 2) {
            this.prevPage = page - 1;
          } else {
            this.prevPage = 1;
          }

          if (page < this.totalPages) {
            this.nextPage = page + 1;
          } else {
            this.nextPage = this.totalPages;
          }

        } else {
          this._router.navigate(['/inicio']);
        }
      }, error => {
        console.log(error);

      }
    );
  }

  pages() {
    this._route.params.subscribe( params => {
      var page = +params['page'];

      if (!page) {
        page = 1;
        this.prevPage = 1;
        this.nextPage = 2;
      }

      this.getTopics(page);
    });
  }
}
