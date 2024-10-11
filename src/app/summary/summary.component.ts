import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PanelComponent } from "./panel/panel.component";

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [PanelComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {

  constructor(private titleService:Title) {
    this.titleService.setTitle("Join - Summary")
  }
}
