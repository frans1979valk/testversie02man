import { DistributionSettings, MANTELZORG_DOMAINS } from '../distribution.service';

export const MantelzorgDistributionConfig: DistributionSettings = {
    id: 'mantelzorg',
    name: 'Mantelzorg Connect',
    appName: 'Mantelzorg Connect',
    domains: MANTELZORG_DOMAINS,
    color: '#4CAF50',
    logo: 'mantelzorg-logo.png',
    features: {
        contactPhotos: true,
        voipEnabled: true,
        emergencyEnabled: true
    }
};