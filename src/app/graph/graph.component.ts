import { Component, OnInit, Input, ChangeDetectorRef, DoCheck, OnChanges, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, DoCheck, OnChanges, AfterViewInit {

  @Input() title;
  @Input() value: number;
  @Output() requestHistory = new EventEmitter();

  public view: any[] = [1000, 400];
  public lastValue = -1;

  public count = 2;
  public multi: any[] = [
    {
      name: '',
      series: [{name: 1, value: 0}]
    }
  ];

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  ngDoCheck(): void {
    if (this.value !== this.lastValue) {
      const temp = this.value;
      const obj = {name: this.count++, value: temp};
      this.multi[0].series.push(obj);
      this.lastValue = this.value;
      // if (this.multi[0].series.length >= 10) {
      //   this.multi[0].series.shift();
      // }
      this.multi = JSON.parse(JSON.stringify(this.multi));
    }
    this.cd.detectChanges();
  }

  ngOnChanges() {
    this.cd.detectChanges();
  }

  ngOnInit() {


    if (this.title) {
      this.multi[0].name = this.title;
    }
  }

  history() {
    this.requestHistory.emit(true);
  }

  onResize(event) { this.view = [event.target.innerWidth - 900, 280 ]; }

}
