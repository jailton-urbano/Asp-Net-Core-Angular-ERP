import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConferenciaService } from 'app/core/services/conferencia.service';
import { CustomSnackbarService } from 'app/core/services/custom-snackbar.service';
import { Conferencia } from 'app/core/types/conferencia.types';
import { UserService } from 'app/core/user/user.service';
import { UserSession } from 'app/core/user/user.types';
import * as moment from 'moment'
declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-conferencia-sala',
  templateUrl: './conferencia-sala.component.html'
})
export class ConferenciaSalaComponent implements OnInit, AfterViewInit {
  conferencia: Conferencia;
  domain: string = "meet.jit.si";
  room: any;
  options: any;
  api: any;
  user: any;
  codConferencia: number;
  sessionData: UserSession;
  isAudioMuted = false;
  isVideoMuted = false;

  constructor(
    private _snack: CustomSnackbarService,
    private _conferenciaService: ConferenciaService,
    private _userSvc: UserService,
    private _route: ActivatedRoute
  ) {
    this.sessionData = JSON.parse(this._userSvc.userSession);
  }

  ngOnInit(): void {
    this.codConferencia = +this._route.snapshot.paramMap.get('codConferencia');
  }

  async ngAfterViewInit() {
    this.conferencia = await this._conferenciaService.obterPorCodigo(this.codConferencia).toPromise();
    this.room = this.conferencia.sala
    this.user = {
      name: this.conferencia.usuarioCadastro.nomeUsuario
    }

    this.options = {
      roomName: this.room,
      width: 900,
      height: 500,
      configOverwrite: { prejoinPageEnabled: false },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [],
      },
      parentNode: document.querySelector('#jitsi-iframe'),
      userInfo: {
        displayName: this.user.name
      }
    }

    this.api = new JitsiMeetExternalAPI(this.domain, this.options);

    this.api.addEventListeners({
      readyToClose: this.handleClose,
      participantLeft: this.handleParticipantLeft,
      participantJoined: this.handleParticipantJoined,
      videoConferenceJoined: this.handleVideoConferenceJoined,
      videoConferenceLeft: this.handleVideoConferenceLeft,
      audioMuteStatusChanged: this.handleMuteStatus,
      videoMuteStatusChanged: this.handleVideoStatus,
    });
  }


  handleClose = () => {
    
  }

  handleParticipantLeft = async (participant) => {
    const data = await this.getParticipants();
  }

  handleParticipantJoined = async (participant) => {
    const data = await this.getParticipants();
  }

  handleVideoConferenceJoined = async (participant) => {
    const data = await this.getParticipants();
  }

  handleVideoConferenceLeft = () => {
    
  }

  handleMuteStatus = (audio) => {
    
  }

  handleVideoStatus = (video) => {
    
  }

  getParticipants() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.api.getParticipantsInfo());
      }, 500)
    });
  }

  copy(){
		navigator.clipboard.writeText('https://meet.jit.si/' + this.room);
		this._snack.exibirToast('Informação Copiada', 'info');
	}

  executeCommand(command: string) {
    this.api.executeCommand(command);
    
    if (command == 'toggleAudio') {
      this.isAudioMuted = !this.isAudioMuted;
    }

    if (command == 'toggleVideo') {
      this.isVideoMuted = !this.isVideoMuted;
    }
  }
}