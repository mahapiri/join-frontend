import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent {
  imgSrcTodo = 'assets/img/edit/default.svg';
  imgSrcDone = 'assets/img/check/default.svg';
}
