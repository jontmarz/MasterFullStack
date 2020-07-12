import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Topic } from '../../models/topic';
import { TopicService } from '../../services/topic.service';
import { Comment } from '../../models/comment';
import { UserService } from '../../services/user.service';
import { CommentService } from '../../services/comment.service';
import { Global } from '../../services/global';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.component.html',
  styleUrls: ['./topic-detail.component.scss'],
  providers: [TopicService, UserService, CommentService]
})
export class TopicDetailComponent implements OnInit {

  public topic: Topic;
  public comment: Comment;
  public identity;
  public token;
  public status;
  public url;
  public borrar = faTrashAlt;

  constructor(
    private _topicService: TopicService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _commentService: CommentService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.comment = new Comment('', '', '', this.identity._id);
    this.url = Global.url;
  }

  ngOnInit(): void {
    this.getTopic();
  }

  getTopic() {
    this._route.params.subscribe( params => {
      var id = params['id'];

      this._topicService.getTopicById(id).subscribe(
        response => {
          if (response.topic) {
            this.topic = response.topic;
          } else {
            this._router.navigate(['/inicio']);
          }
        }, error => {
          console.log(error);

        }
      );
    });
  }

  onSubmit(form) {
    // console.log(this.comment);
    this._commentService.add(this.token, this.comment, this.topic._id).subscribe(
      response => {
        console.log(response);

        if (response.error) {
          this.status = 'error';
        } else {
          this.status = 'success';
          this.topic = response.topic;
          form.reset();
        }
      }, error => {
        this.status = error;
        console.log(error);
      }
    );
  }

  deleteComment(id) {
    this._commentService.delete(this.token, this.topic._id, id).subscribe(
      response => {
        // console.log(response);
        if (response.error) {
          this.status = 'error';
        } else {
          this.status = 'success';
          this.topic = response.topic;
        }
      }, error => {
        this.status = error;
        console.log(error);
      }
    );
  }
}
