import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-adding',
  standalone: true,
  imports: [],
  templateUrl: './adding.component.html',
  styleUrl: './adding.component.scss'
})
export class AddingComponent {
  addBoard: string = 'Task added to board';
  addContact: string = 'Contact succesfully created';
  deleteContact: string = 'Contact succesfully deleted';
  addUser: string = 'You Signed Up successfully';
  addCategory: string = 'Category succesfully created';

  constructor(
    public sharedService: SharedService,
  ) { }
}
