import {Component, HostListener, OnInit} from '@angular/core';
import {AppService} from "./app.service";
import {Subject, takeUntil} from "rxjs";
import {ToastService} from "./toast.service";
import {Options} from "@angular-slider/ngx-slider";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{

  valueRanges;
  title = 'Music-Playlist-Frontend';
  showLoader = false;
  queryParamsPageNumber = 1;
  filteredArtists = [];
  recentFilters = [
    {label: 'Rap de', isEdit: false},
    {label: 'US big in EU', isEdit: false},
    {label: 'New Dance UK', isEdit: false}
  ];
  filters = {
    spotify: {
      spotify_monthly_listeners: {
        value: {
          min: null,
          max: null
        },
        options: {
          floor: null,
          ceil: null,
          step: 32
        },
        enabled: true
      },
      spotify_follower: {
        value: {
          min: null,
          max: 0,
          power: 0
        },
        options: {
          floor: null,
          ceil: null,
          step: 1,
        },
        enabled: true
      },
      top_track_streams: {
        value: {
          min: null,
          max: null
        },
        options: {
          floor: null,
          ceil: null
        },
        enabled: true
      },
      recent_track_streams: {
        value: {
          min: null,
          max: null
        },
        options: {
          floor: null,
          ceil: null
        },
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
  sortByOptions = [
    {label: 'Spotify Monthly Listeners', value: 'SPOTIFY_MONTHLY_LISTENERS'},
    {label: 'Spotify Followers', value: 'SPOTIFY_FOLLOWERS'},
    {label: 'Recent Track Streams', value: 'RECENT_TRACK_STREAMS'},
    {label: 'Top Track Streams', value: 'TOP_TRACK_STREAMS'}
  ];
  playerOptions: Options = {
    floor: 0,
    ceil: 100
  };

  @HostListener("window:scroll", []) onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.queryParamsPageNumber += 1;
      this.setQueryParams();
    }
  }

  private componentInView = new Subject();

  constructor(
    private appService: AppService,
    private toastService: ToastService
  ) {
  }

  ngOnInit(): void {
    this.getFilteredArtists();
    this.getValueRanges();
  }

  getFilteredArtists(queryParams = null): void {
    this.showLoader = true;
    this.appService.getFilteredArtists(queryParams).pipe(takeUntil(this.componentInView)).subscribe(response => {
      this.showLoader = false;
      this.filteredArtists = [...this.filteredArtists, ...response];
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
      this.filterTypes.forEach(type => {
        this.setFilterInterval('spotify', type);
      });
    }, error => {
      this.showLoader = false;
      this.toastService.error(error.error.message);
    });
  }

  setFilterInterval(key, filter): void {
    if (this.filters && this.filters[key]) {
      if (this.filters[key][filter]) {
        this.filters[key][filter].options.floor = 0;
        this.filters[key][filter].options.ceil = +this.valueRanges.intervals[filter][1];
        this.filters[key][filter].value.min = +this.valueRanges.intervals[filter][0];
        this.filters[key][filter].value.max = +this.valueRanges.intervals[filter][1];
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

      queryParams['page'] = this.queryParamsPageNumber;
    }

    this.getFilteredArtists(queryParams);
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

  onSortByChanged(event): void {
    const value = event.value;

    if (value === 'SPOTIFY_MONTHLY_LISTENERS') {
      this.filteredArtists = this.filteredArtists.sort((value1, value2) => +value1.spotify_monthly_listeners > +value2.spotify_monthly_listeners ? 1 : -1 );
    }

    if (value === 'SPOTIFY_FOLLOWERS') {
      this.filteredArtists = this.filteredArtists.sort((value1, value2) => +value1.spotify_follower > +value2.spotify_follower ? 1 : -1 );
    }

    if (value === 'RECENT_TRACK_STREAMS') {
      this.filteredArtists = this.filteredArtists.sort((value1, value2) => +value1.recent_track_streams > +value2.recent_track_streams ? 1 : -1 );
    }

    if (value === 'TOP_TRACK_STREAMS') {
      this.filteredArtists = this.filteredArtists.sort((value1, value2) => +value1.top_track_streams > +value2.top_track_streams ? 1 : -1 );
    }
  }

  countEnabledFilters(filter): number {
    let count = 0;
    if (filter === 'spotify') {
      this.filterTypes.forEach(type => {
        if (this.filters[filter][type].enabled) {
          count++;
        }
      });
    }

    return count;
  }

  onSliderValueChanged(event): void {
    this.filters.spotify.spotify_follower.value.power++;
    if (this.filters.spotify.spotify_follower.value.min === this.filters.spotify.spotify_follower.options.ceil) {
      this.filters.spotify.spotify_follower.value.min = this.filters.spotify.spotify_follower.value.min / 2;
    } else  {
      this.filters.spotify.spotify_follower.value.min = Math.pow(2, this.filters.spotify.spotify_follower.value.power);
    }

    this.filters.spotify.spotify_follower = {...this.filters.spotify.spotify_follower};
    this.filters = {...this.filters};

    console.log( this.filters.spotify.spotify_follower);
  }
}
