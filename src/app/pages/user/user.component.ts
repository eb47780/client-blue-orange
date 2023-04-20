import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
  }

  private userId$: Observable<string> = this.activatedRoute.params.pipe(
    map((params: Params) => params['id'])
  )

  user$: Observable<User> = this.userId$.pipe(
    switchMap((userId: string) => this.userService.getUser(userId))
  )

}
