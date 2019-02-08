import { Hero, heroes } from './../heroes';
import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-virtual-table',
  templateUrl: './virtual-table.component.html',
  styleUrls: ['./virtual-table.component.css']
})
export class VirtualTableComponent implements OnInit, AfterViewInit {

  @ViewChild(CdkScrollable) scrollable: CdkScrollable;
  totalItems = 100000;
  itemsToShow = 50;
  percentageOfRunway = new BehaviorSubject<number>(1);
  index$: Observable<number>;
  lineHeight = 63;
  totalRunway = this.totalItems * this.lineHeight;
  topBufferStyle$: Observable<{[key: string]: string}>;
  bottomBufferStyle$: Observable<{[key: string]: string}>;

  heroes: Hero[] = [];
  superlatives$ = new BehaviorSubject<{[superlativeName: string]: string}>({});
  tableDataSource$: Observable<Hero[]>;
  displayedColumns$ = new BehaviorSubject<string[]>([
    'name',
    'types',
    'attack',
    'defense',
    'speed',
    'healing',
    'recovery',
    'health'
  ]);

  constructor(private scrollDispatcher: ScrollDispatcher, private cdr: ChangeDetectorRef) {
    // console.log(this.scrollDispatcher);
    // for (const [key, value] of this.scrollDispatcher.scrollContainers.entries()) {
    //   console.log(key, value);
    // }
    // console.log(this.scrollDispatcher.scrollContainers.keys());
    // console.log(this.scrollDispatcher.scrollContainers.keys);
    this.scrollDispatcher.scrolled().subscribe(x => {
      // console.log(x);
      // console.log((x as CdkScrollable).measureScrollOffset('bottom'));
      // console.log('scrolled');
      if (this.scrollable) {
        const runwayRemaining = this.scrollable.measureScrollOffset('bottom');
        const percentOfRunwayConsumed = runwayRemaining / this.totalRunway;
        if (this.percentageOfRunway.value !== percentOfRunwayConsumed) {
          this.percentageOfRunway.next(percentOfRunwayConsumed);
        }
      }
    });
  }

  ngOnInit() {
    for (let i = 0; i < this.totalItems; i++) {
      this.heroes.push({ ...heroes[Math.floor(i === 0 ? i : i % heroes.length)], name: `${i}` });
    }

    this.index$ = this.percentageOfRunway.pipe(
      map(x => {
        const midPoint = Math.floor((1 - x) * this.totalRunway / this.lineHeight);
        if (midPoint - this.itemsToShow / 2 < 0) {
          return 0;
        } else if (midPoint + this.itemsToShow / 2 > this.heroes.length - this.itemsToShow) {
          return this.heroes.length - this.itemsToShow;
        }
        return Math.floor(midPoint - this.itemsToShow / 2);
      })
    );

    let prevIndex = 0;
    this.tableDataSource$ = this.index$.pipe(
      map(index => {
        if (index !== prevIndex) {
          prevIndex = index;
          setTimeout(() => this.cdr.detectChanges(), 0);
        }
        return this.heroes.slice(index, index + this.itemsToShow);
      })
    );

    this.topBufferStyle$ = this.index$.pipe(
      map(index => ({ height: `${this.lineHeight * index}px`}))
    );

    this.bottomBufferStyle$ = this.index$.pipe(
      map(index => ({ height: `${this.lineHeight * (this.heroes.length - (index + this.itemsToShow))}px` }))
    );
  }

  ngAfterViewInit() {
    // this.scrollable.elementScrolled().subscribe(x => console.log);
  }

}
