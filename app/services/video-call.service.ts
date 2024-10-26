import { Observable } from '@nativescript/core';
import { ErrorHandlingService } from './error-handling.service';
import { AudioDetectionService } from './audio-detection.service';

export interface VideoConfig {
    maxBitrate: number;
    maxFramerate: number;
    preferredResolution: {
        width: number;
        height: number;
    };
}

export class VideoCallService extends Observable {
    private static instance: VideoCallService;
    private audioService: AudioDetectionService;
    private _isInitialized: boolean = false;
    private _currentCall: any = null;
    private _localStream: any = null;
    private _remoteStream: any = null;
    private _peerConnection: any = null;

    private _config: VideoConfig = {
        maxBitrate: 800000, // 800kbps voor stabiele video
        maxFramerate: 24,
        preferredResolution: {
            width: 640,
            height: 480
        }
    };

    private constructor() {
        super();
        this.audioService = AudioDetectionService.getInstance();
        this.initialize();
    }

    static getInstance(): VideoCallService {
        if (!VideoCallService.instance) {
            VideoCallService.instance = new VideoCallService();
        }
        return VideoCallService.instance;
    }

    private async initialize() {
        try {
            await this.setupWebRTC();
            this._isInitialized = true;
        } catch (error) {
            ErrorHandlingService.getInstance().handleError(error, {
                title: 'Video Initialisatie Fout',
                message: 'Kan video service niet initialiseren',
                isCritical: true
            });
        }
    }

    private async setupWebRTC() {
        const configuration = {
            iceServers: [
                { urls: 'stun:stun.mantelzorgconnect.nl:3478' },
                {
                    urls: 'turn:turn.mantelzorgconnect.nl:3478',
                    username: 'mantelzorg',
                    credential: 'turnserver'
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
            this._remoteStream = event.streams[0];
            this.notifyPropertyChange('remoteStream', this._remoteStream);
        };
    }

    async startVideoCall(contactId: string): Promise<boolean> {
        try {
            if (!this._isInitialized) {
                throw new Error('Video service niet geïnitialiseerd');
            }

            // Start lokale video stream
            this._localStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: this._config.preferredResolution.width,
                    height: this._config.preferredResolution.height,
                    frameRate: this._config.maxFramerate
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            // Voeg tracks toe aan peer connection
            this._localStream.getTracks().forEach(track => {
                this._peerConnection.addTrack(track, this._localStream);
            });

            // Maak en verstuur offer
            const offer = await this._peerConnection.createOffer();
            await this._peerConnection.setLocalDescription(offer);

            // Verstuur offer naar contact
            const callId = await this.sendCallOffer(contactId, offer.sdp);
            
            this._currentCall = {
                id: callId,
                contactId: contactId,
                startTime: new Date(),
                type: 'video'
            };

            this.notifyPropertyChange('localStream', this._localStream);
            return true;

        } catch (error) {
            ErrorHandlingService.getInstance().handleError(error, {
                title: 'Video Oproep Fout',
                message: 'Kan video gesprek niet starten',
                isCritical: false
            });
            return false;
        }
    }

    async acceptVideoCall(callId: string): Promise<boolean> {
        try {
            // Start lokale video stream
            this._localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            // Voeg tracks toe
            this._localStream.getTracks().forEach(track => {
                this._peerConnection.addTrack(track, this._localStream);
            });

            // Accepteer inkomende call
            await this.sendCallAccept(callId);
            
            this.notifyPropertyChange('localStream', this._localStream);
            return true;

        } catch (error) {
            ErrorHandlingService.getInstance().handleError(error, {
                title: 'Video Acceptatie Fout',
                message: 'Kan video gesprek niet accepteren',
                isCritical: false
            });
            return false;
        }
    }

    async endVideoCall(): Promise<void> {
        try {
            if (this._currentCall) {
                // Stop alle streams
                if (this._localStream) {
                    this._localStream.getTracks().forEach(track => track.stop());
                }
                
                // Sluit peer connection
                if (this._peerConnection) {
                    this._peerConnection.close();
                }

                // Reset streams
                this._localStream = null;
                this._remoteStream = null;
                
                // Stuur einde gesprek signaal
                await this.sendCallEnd(this._currentCall.id);
                
                this._currentCall = null;

                // Notificeer UI
                this.notifyPropertyChange('localStream', null);
                this.notifyPropertyChange('remoteStream', null);
            }
        } catch (error) {
            console.error('Fout bij beëindigen video gesprek:', error);
        }
    }

    private async sendCallOffer(contactId: string, sdp: string): Promise<string> {
        // Implementeer signaling naar contact
        return 'call_' + Date.now();
    }

    private async sendCallAccept(callId: string): Promise<void> {
        // Implementeer call acceptatie
    }

    private async sendCallEnd(callId: string): Promise<void> {
        // Implementeer call beëindiging
    }

    private async sendIceCandidate(candidate: RTCIceCandidate) {
        // Implementeer ICE candidate verzending
    }

    get localStream(): any {
        return this._localStream;
    }

    get remoteStream(): any {
        return this._remoteStream;
    }

    get currentCall(): any {
        return this._currentCall;
    }
}