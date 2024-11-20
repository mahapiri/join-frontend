import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-overview.component.html',
  styleUrl: './contact-overview.component.scss'
})
export class ContactOverviewComponent {
  userServiceSubscription: Subscription = new Subscription();
  users: User[] = [];


  constructor(public userService: UserService) {
    this.userServiceSubscription = this.userService.users$.subscribe((user) => {
      user.forEach((u) => {
        this.users.push(u);
      })
    })

    if(this.users.length > -1) {

    }
  }

  ngOnDestroy(): void {
    this.userServiceSubscription.unsubscribe();
  }

  editContact(i: number) {
    console.log(i);
  }

  deleteContact(i: number) {
    console.log(i);
  }
}
