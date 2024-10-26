import { Observable } from '@nativescript/core';
import { ErrorHandlingService } from './error-handling.service';
import { AudioDetectionService } from './audio-detection.service';

export interface VoIPConfig {
    server: string;
    port: number;
    username: string;
    password: string;
    stunServer?: string;
    turnServer?: string;
    iceServers?: string[];
    codecs: string[];
}

export class VoIPService extends Observable {
    private static instance: VoIPService;
    private audioService: AudioDetectionService;
    private _isInitialized: boolean = false;
    private _isConnected: boolean = false;
    private _currentCall: any = null;
    private _config: VoIPConfig;
    private _peerConnection: any = null;

    private constructor() {
        super();
        this.audioService = AudioDetectionService.getInstance();
        this._config = {
            server: 'voip.cheapconnect.net',
            port: 5080,
            username: '31453690196',
            password: '',
            codecs: ['OPUS', 'G711']
        };
        this.initialize();
    }

    static getInstance(): VoIPService {
        if (!VoIPService.instance) {
            VoIPService.instance = new VoIPService();
        }
        return VoIPService.instance;
    }

    private async initialize() {
        try {
            await this.setupWebRTC();
            this._isInitialized = true;
        } catch (error) {
            ErrorHandlingService.getInstance().handleError(error, {
                title: 'VoIP Initialisatie Fout',
                message: 'Kan VoIP service niet initialiseren',
                isCritical: true
            });
        }
    }

    private async setupWebRTC() {
        const configuration = {
            iceServers: [
                { urls: 'stun:stun.cheapconnect.net:3478' },
                {
                    urls: 'turn:turn.cheapconnect.net:3478',
                    username: this._config.username,
                    credential: this._config.password
                }
            ]
        };

        this._peerConnection = new RTCPeerConnection(configuration);
        
        this._peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                this.sendIceCandidate(event.candidate);
            }
        };

        this._peerConnection.ontrack = (event) => {
            this.handleRemoteTrack(event.track);
        };

        await this.setupLocalMedia();
    }

    private async setupLocalMedia() {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        });

        stream.getTracks().forEach(track => {
            this._peerConnection.addTrack(track, stream);
        });
    }

    async makeCall(number: string): Promise<boolean> {
        try {
            if (!this._isInitialized) {
                throw new Error('VoIP service niet geïnitialiseerd');
            }

            const offer = await this._peerConnection.createOffer({
                offerToReceiveAudio: true
            });

            await this._peerConnection.setLocalDescription(offer);

            // Stuur SIP INVITE
            const callId = await this.sendSipInvite(number, offer.sdp);
            
            this._currentCall = {
                id: callId,
                number: number,
                startTime: new Date()
            };

            return true;
        } catch (error) {
            ErrorHandlingService.getInstance().handleError(error, {
                title: 'Belfout',
                message: 'Kan gesprek niet opzetten',
                isCritical: false
            });
            return false;
        }
    }

    private async sendSipInvite(number: string, sdp: string): Promise<string> {
        // Implementeer SIP INVITE verzending
        return 'call_' + Date.now();
    }

    private async sendIceCandidate(candidate: RTCIceCandidate) {
        // Stuur ICE candidate naar andere partij
    }

    private handleRemoteTrack(track: MediaStreamTrack) {
        const remoteStream = new MediaStream([track]);
        // Speel remote audio af
    }

    async endCall(): Promise<void> {
        if (this._currentCall) {
            // Stuur SIP BYE
            await this.sendSipBye(this._currentCall.id);
            
            this._currentCall = null;
            await this._peerConnection.close();
            await this.setupWebRTC();
        }
    }

    private async sendSipBye(callId: string): Promise<void> {
        // Implementeer SIP BYE verzending
    }

    get isConnected(): boolean {
        return this._isConnected;
    }

    get currentCall(): any {
        return this._currentCall;
    }
}