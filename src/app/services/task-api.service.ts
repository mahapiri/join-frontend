import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { SummaryData } from '../models/summary-data';

@Injectable({
  providedIn: 'root'
})
export class TaskApiService {
  private _sumdata = new BehaviorSubject<SummaryData | null>(null);
  task$ = this._sumdata.asObservable();

  apiUrl = "http://127.0.0.1:8000/api/tasks"

  constructor() { }


  async getSummaryData() {
    try {
      const response = await fetch(`${this.apiUrl}/summary/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'},
      })

      const datas = await response.json();

      if(datas) {
        datas['upcoming_deadline'] = this.formatDate(datas['upcoming_deadline'])
        this._sumdata.next(datas);
      }

    } catch (error) {
      console.log('Fehler', error)
      this._sumdata.next(null);
    }
  }


  formatDate(date: any): string {
    let splitValues = date.split("-");
    return `${splitValues[2]}/${splitValues[1]}/${splitValues[0]}`;
  }
}
