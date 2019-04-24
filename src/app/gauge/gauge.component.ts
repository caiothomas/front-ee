import { Component, OnInit, Input, ChangeDetectorRef, DoCheck, OnChanges, ViewEncapsulation, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GaugeComponent implements OnInit, DoCheck, OnChanges {

  @Input() title;
  @Input() bottom;
  @Input() color;
  @Input() range;
  @Input() value = 0;
  @Output() requestHistory = new EventEmitter();

  public lastValue = -1;
  public canvasWidth = 300;
  public centralLabel = '';
  public name = '';
  public bottomLabel = '';
  public options = null;

  constructor(
    private cd: ChangeDetectorRef
  ) { }


  ngDoCheck(): void {
    if (this.value !== this.lastValue) {
      this.lastValue = this.value;
      this.bottomLabel = this.value + ' ' + this.bottom;
    }
    this.cd.detectChanges();
  }

  ngOnChanges() {
    this.cd.detectChanges();
  }

  ngOnInit() {
    if (this.title) {
      this.name = this.title;
    }

    this.options = {
      hasNeedle: true,
      needleColor: 'gray',
      needleUpdateSpeed: 300,
      arcColors: ['rgb(61,204,91)'],
      needleStartValue: 50,
      rangeLabel: ['0', '100'],
    };

    if (this.color) {
      this.options.arcColors = [this.color];
    }

    if (this.range) {
      this.options.rangeLabel = this.range;
    }

  }

  history() {
    this.requestHistory.emit(true);
  }


}
