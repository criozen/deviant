import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-airdrop',
  templateUrl: './airdrop.component.html',
  styleUrls: ['./airdrop.component.css']
})
export class AirdropComponent implements OnInit {
  public files: File[] = [];
  public isTabActive: number = 0;
  constructor() { }

  ngOnInit(): void {
  }
  async onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }
  onRemove(event: File) { 
    this.files.splice(this.files.indexOf(event), 1);
   
  }
  setActiveTab(index: number) {
    this.isTabActive = index;
  }

}
