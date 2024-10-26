export interface VoIPSettings {
    enabled: boolean;
    serverAddress: string;
    alternativeServerAddress?: string;
    username: string;
    password: string;
    callerId: string;
    ports: number[];
    defaultPort: number;
    codec: {
        preferences: string[];
    };
    dtmf: string;
    stunEnabled: boolean;
    sipAlgBypass: boolean;
    registrationTimeout: number;
}

export const DEFAULT_VOIP_SETTINGS: VoIPSettings = {
    enabled: true,
    serverAddress: 'voip.cheapconnect.net',
    alternativeServerAddress: 'sip.cheapconnect.net',
    username: '31453690196',
    callerId: '+31453690196',
    password: '',
    ports: [5060, 5070, 5072, 5074, 5076, 5078, 5080],
    defaultPort: 5080,
    codec: {
        preferences: ['G.711A', 'G.729A/B']
    },
    dtmf: 'RFC2833',
    stunEnabled: false,
    sipAlgBypass: true,
    registrationTimeout: 3600
};