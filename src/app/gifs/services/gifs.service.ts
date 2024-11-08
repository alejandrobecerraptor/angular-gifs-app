import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {

  gifList: Gif[] = [];


  private _tagsHistory: string[] = [];
  private apiKey: string = 'WOTxvkSoXBuV4q6buBMwVH81PFgtuUdw';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string): void {
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }
    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.slice(0, 10);
    this.saveLocalStorage()
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage():void {
    if( !localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse( localStorage.getItem('history')! );

    if ( this._tagsHistory.length === 0 ) return;
    this.searchTag( this._tagsHistory[0] );
  }

  searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    this.http.get<SearchResponse>(`https://api.giphy.com/v1/gifs/search?api_key=${this.apiKey}&q=${tag}&limit=10`)
      .subscribe((response) => {
        this.gifList = response.data;
      });
  }
}
