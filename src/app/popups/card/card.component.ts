import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  checkboxUrl: string = 'assets/img/check-btn/default-disable.svg';
  clickedCheckbox: boolean = false;
  
  toggleCheck() {
    this.clickedCheckbox = !this.clickedCheckbox;
    this.updateCheckboxUrl();
  }
  
  hoverCheckbox() {
    if (this.clickedCheckbox) {
      this.checkboxUrl = 'assets/img/check-btn/hover-checked.svg';
    } else {
      this.checkboxUrl = 'assets/img/check-btn/hover-disable.svg';
    }
  }
  
  leaveCheckbox() {
    this.updateCheckboxUrl();
  }
  
  updateCheckboxUrl() {
    if (this.clickedCheckbox) {
      this.checkboxUrl = 'assets/img/check-btn/default-checked.svg';
    } else {
      this.checkboxUrl = 'assets/img/check-btn/default-disable.svg';
    }
  }


  // clickedCheckbox ? 'assets/img/check-btn/default-checked.svg' : 'assets/img/check-btn/default-disable.svg'
}
