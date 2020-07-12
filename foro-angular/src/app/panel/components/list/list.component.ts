import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Topic } from '../../../models/topic';
import { UserService } from '../../../services/user.service';
import { TopicService } from '../../../services/topic.service';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [UserService, TopicService]
})
export class ListComponent implements OnInit {

  public page_title: string;
  public topics: Array<Topic>;
  public identity;
  public token;
  public status;
  public editar = faEdit;
  public borrar = faTrashAlt;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _topicService: TopicService
  ) {
    this.page_title = 'Mis Temas';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this.getTopics();
  }

  getTopics() {
    const userId = this.identity._id;
    this._topicService.getMyTopicsByUser(userId).subscribe(
      response => {
        if (response.topics) {
          this.topics = response.topics;
          // console.log(this.topics);
        }
      }, error => {
        console.log(error);
      }
    );
  }

  deleteTopic(id){
    this._topicService.delete(this.token, id).subscribe(
      response => {
        this.getTopics();
      }, error => {
        console.log('Error en el servidor');
      }
    );
  }
}
