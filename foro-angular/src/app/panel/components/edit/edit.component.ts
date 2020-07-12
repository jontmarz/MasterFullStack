import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Topic } from '../../../models/topic';
import { UserService } from '../../../services/user.service';
import { TopicService } from '../../../services/topic.service';

@Component({
  selector: 'app-edit',
  templateUrl: '../add/add.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [UserService, TopicService]
})
export class EditComponent implements OnInit {

  public page_title: string;
  public topic: Topic;
  public identity;
  public token;
  public status;
  public isEdit: boolean;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _topicService: TopicService
  ) {
    this.page_title = 'Editar Tema';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.topic = new Topic('', '', '', '', '', '', this.identity._id, null);
    this.isEdit = true;
  }

  ngOnInit(): void {
    this.getTopic();
  }

  getTopic() {
    this._route.params.subscribe(params => {
      const id = params['id'];
      // console.log(id);

      this._topicService.getTopic(id).subscribe(
        response => {
          if (!response.topic) {
            this._router.navigate(['/panel']);
          } else {
            this.topic = response.topic;
          }
        }, error => {
          console.log(error);
        }
      );
    });
  }

  onSubmit(form) {
    const id = this.topic._id;
    this._topicService.update(this.token, id, this.topic).subscribe(
      response => {
        if (response.topic) {
          this.status = 'success';
          this.topic = response.topic;
          console.log(response.topic);
        } else {
          this.status = 'error';
        }
      }, error => {
        this.status = 'error';
        console.log(error);
      }
    );
  }
}
