import { Component, OnInit } from '@angular/core';
import { StreamsService } from '../../services/streams-service/streams-service';
import { LiveStream } from '../../entities/live-stream.entity';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from '../../services/configuration-service/configuration.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  private liveStream: LiveStream;
  private isLoading: boolean = true;
  private connectionError: boolean = false ;

  constructor(private route: ActivatedRoute,
    private streamsService: StreamsService,
  private configurationService: ConfigurationService) { }

  ngOnInit() {
    this.GetLiveStream();
  }

  private GetLiveStream() {
    const id = this.route.snapshot.paramMap.get('id');

    this.streamsService.getLiveStream(id)
      .subscribe((stream) => {
        this.liveStream = stream;
      }, (error) => {
        this.connectionError = true;
        this.isLoading = false;
      }, () => {
        this.isLoading = false;
        this.InitializePlayer();
      })
    }

    private InitializePlayer(): void {
      
    }

    private onPlay(): void {
      debugger;
    }
}
