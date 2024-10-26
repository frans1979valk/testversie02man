import { Observable } from '@nativescript/core';
import { AudioDetectionService, AudioDevice } from '../../services/audio-detection.service';
import { NavigationService } from '../../services/navigation.service';

export class AudioSetupViewModel extends Observable {
    private audioService: AudioDetectionService;
    private navigationService: NavigationService;
    private _showTestResults: boolean = false;
    private _inputTestResult: string = '';
    private _outputTestResult: string = '';
    private _canSave: boolean = false;

    constructor() {
        super();
        this.audioService = AudioDetectionService.getInstance();
        this.navigationService = NavigationService.getInstance();
        this.initializeDevices();
    }

    private async initializeDevices() {
        // Wacht tot audio service klaar is met initialiseren
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.notifyPropertyChange('audioInputDevices', this.audioInputDevices);
        this.notifyPropertyChange('audioOutputDevices', this.audioOutputDevices);
        this.updateSaveButton();
    }

    get audioInputDevices(): AudioDevice[] {
        return this.audioService.audioInputDevices.map(device => ({
            ...device,
            isSelected: device.id === this.audioService.selectedInput
        }));
    }

    get audioOutputDevices(): AudioDevice[] {
        return this.audioService.audioOutputDevices.map(device => ({
            ...device,
            isSelected: device.id === this.audioService.selectedOutput
        }));
    }

    get showTestResults(): boolean {
        return this._showTestResults;
    }

    get inputTestResult(): string {
        return this._inputTestResult;
    }

    get outputTestResult(): string {
        return this._outputTestResult;
    }

    get canSave(): boolean {
        return this._canSave;
    }

    async selectInput(args: any) {
        const device = args.object.bindingContext;
        if (await this.audioService.selectAudioInput(device.id)) {
            this.notifyPropertyChange('audioInputDevices', this.audioInputDevices);
            this.updateSaveButton();
        }
    }

    async selectOutput(args: any) {
        const device = args.object.bindingContext;
        if (await this.audioService.selectAudioOutput(device.id)) {
            this.notifyPropertyChange('audioOutputDevices', this.audioOutputDevices);
            this.updateSaveButton();
        }
    }

    async testInput() {
        this._showTestResults = true;
        this._inputTestResult = 'Test bezig...';
        this.notifyPropertyChange('showTestResults', true);
        this.notifyPropertyChange('inputTestResult', this._inputTestResult);

        const success = await this.audioService.testAudioInput();
        this._inputTestResult = success ? 'OK ✓' : 'Fout ✗';
        this.notifyPropertyChange('inputTestResult', this._inputTestResult);
        this.updateSaveButton();
    }

    async testOutput() {
        this._showTestResults = true;
        this._outputTestResult = 'Test bezig...';
        this.notifyPropertyChange('showTestResults', true);
        this.notifyPropertyChange('outputTestResult', this._outputTestResult);

        const success = await this.audioService.testAudioOutput();
        this._outputTestResult = success ? 'OK ✓' : 'Fout ✗';
        this.notifyPropertyChange('outputTestResult', this._outputTestResult);
        this.updateSaveButton();
    }

    private updateSaveButton() {
        this._canSave = !!(
            this.audioService.selectedInput && 
            this.audioService.selectedOutput
        );
        this.notifyPropertyChange('canSave', this._canSave);
    }

    async saveSettings() {
        // Sla de geselecteerde apparaten op en ga terug
        this.navigationService.goBack();
    }
}