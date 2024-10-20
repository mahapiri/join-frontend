import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DistributionComponent } from "./distribution/distribution.component";

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [DistributionComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle("Join - Board");
  }
}
