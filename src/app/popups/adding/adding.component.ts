import { Component } from '@angular/core';

@Component({
  selector: 'app-adding',
  standalone: true,
  imports: [],
  templateUrl: './adding.component.html',
  styleUrl: './adding.component.scss'
})
export class AddingComponent {
  text: string = 'Task added to board';
  addBoard: string = 'Task added to board';
  addContact: string = 'Contact succesfully created';
  addUser: string = 'You Signed Up successfully';
}
