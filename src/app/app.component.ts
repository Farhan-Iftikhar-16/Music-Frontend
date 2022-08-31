import {Component, OnInit} from '@angular/core';
import {AppService} from "./app.service";
import {Subject, takeUntil} from "rxjs";
import {ToastService} from "./toast.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  val = 0;
  val1 = 0;
  val2 = 0;
  val3 = 0;

  valueRanges;
  title = 'Music-Playlist-Frontend';
  showLoader = false;
  recentFilters = [
    {label: 'Rap de', isEdit: false},
    {label: 'US big in EU', isEdit: false},
    {label: 'New Dance UK', isEdit: false}
  ]

  filterArtists = [];
  filters = {
    spotify: {
      spotify_monthly_listeners: {
        interval: {
          min: 0,
          max: 0
        },
        value: {
          min: 0,
          max: 0
        },
        selectedInterval : [0, 0] as number[],
        enabled: true
      },
      spotify_follower: {
        interval: {
          min: 0,
          max: 0
        },
        value: {
          min: 0,
          max: 0
        },
        selectedInterval : [0, 0] as number[],
        enabled: true
      },
      top_track_streams: {
        interval: {
          min: 0,
          max: 0
        },
        value: {
          min: 0,
          max: 0
        },
        selectedInterval : [0, 0] as number[],
        enabled: true
      },
      recent_track_streams: {
        interval: {
          min: 0,
          max: 0
        },
        value: {
          min: 0,
          max: 0
        },
        selectedInterval : [0, 0] as number[],
        enabled: true
      },
      filterTypeEnabled: true
    },
    instagram: {
      filterTypeEnabled: false
    },
    youtube: {
      filterTypeEnabled: false
    },
    genre: {
      filterTypeEnabled: false
    },
    countries: {
      filterTypeEnabled: false
    }
  }
  filterTypes = ['spotify_monthly_listeners', 'spotify_follower', 'top_track_streams', 'recent_track_streams'];

  private componentInView = new Subject();

  constructor(
    private appService: AppService,
    private toastService: ToastService
  ) {
  }

  ngOnInit(): void {
    this.getFilterArtists();
    this.getValueRanges();
  }

  getFilterArtists(queryParams = null): void {
    this.showLoader = true;
    this.appService.getFilterArtists(queryParams).pipe(takeUntil(this.componentInView)).subscribe(response => {
      this.showLoader = false;
      this.filterArtists = response;
    }, error => {
      this.showLoader = false;
      this.toastService.error(error.error.message);
    });
  }

  getValueRanges(): void {
    this.showLoader = true;

    this.appService.getValueRanges().pipe(takeUntil(this.componentInView)).subscribe(response => {
      this.showLoader = false;
      this.valueRanges = response;
      for (let interval in response.intervals) {
        this.filterTypes.forEach(type => {
          this.setFilterInterval('spotify', type);
        });
      }
    }, error => {
      this.showLoader = false;
      this.toastService.error(error.error.message);
    });
  }

  setFilterInterval(key, filter): void {
    if (this.filters && this.filters[key]) {
      if (this.filters[key][filter]) {
        this.filters[key][filter].interval.min = this.valueRanges.intervals[filter][0];
        this.filters[key][filter].interval.max = this.valueRanges.intervals[filter][1];
        this.filters[key][filter].selectedInterval = [+this.valueRanges.intervals[filter][0], +this.valueRanges.intervals[filter][1]];
        this.filters[key][filter].value.min = this.valueRanges.intervals[filter][0];
        this.filters[key][filter].value.max = this.valueRanges.intervals[filter][1];
      }
    }
  }

  setQueryParams(): void {
    let queryParams = {};

    for(let key in this.filters) {
      if (this.filters[key].filterTypeEnabled) {
        this.filterTypes.forEach(filterType => {
          if (this.filters[key][filterType] && this.filters[key][filterType].enabled) {
            queryParams['min_' + filterType] = this.filters[key][filterType].value.min;
            queryParams['max_' + filterType] = this.filters[key][filterType].value.max;
          }
        });
      }
    }

    this.getFilterArtists(queryParams);
  }

  getFormat(number){
    if(number == 0) {
      return 0;
    }

    if(number <= 999){
      return number ;
    }

    if(number >= 1000 && number <= 999999){
      return (number / 1000) + 'K';
    }

    if(number >= 1000000 && number <= 999999999){
      return (number / 1000000) + 'M';
    }

    if(number >= 1000000000 && number <= 999999999999){
      return (number / 1000000000) + 'B';
    }
  }
}
