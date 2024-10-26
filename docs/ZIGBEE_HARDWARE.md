# Zigbee Hardware Opties

## Android TV Boxes met Zigbee

### 1. SONOFF ZBBridge-P
- Android TV box met ingebouwde Zigbee 3.0
- Prijs: €69,95
- Features:
  * 4K Android TV
  * Zigbee 3.0 coordinator
  * WiFi + Ethernet
  * HDMI output
  * Local API
- Voordelen:
  * All-in-one oplossing
  * Geen extra hub nodig
  * Kosteneffectief
  * Eenvoudige setup
- Nadelen:
  * Beperkt bereik
  * Geen mesh networking
  * Minder flexibel

### 2. Homatics Box R 4K met Zigbee Stick
- High-end Android TV box
- Prijs: €149 + €39 (Zigbee stick)
- Features:
  * Android TV 11
  * 4K HDR
  * USB 3.0 voor Zigbee stick
  * Dual-band WiFi
  * Bluetooth 5.0
- Voordelen:
  * Krachtige hardware
  * Flexibele configuratie
  * Toekomstbestendig
- Nadelen:
  * Hogere prijs
  * Complexere setup
  * Twee apparaten nodig

## Routers met Zigbee

### 1. Huawei WiFi AX3 Pro
- Router met Zigbee module
- Prijs: €99
- Features:
  * WiFi 6
  * Zigbee 3.0
  * 4 antennes
  * 1.4 GHz CPU
- Voordelen:
  * Geïntegreerde oplossing
  * Goed bereik
  * Dual-purpose
- Nadelen:
  * Beperkte Zigbee features
  * Gesloten ecosystem
  * Beperkte API

### 2. Asus ROG Rapture GT-AX11000 Pro
- Gaming router met Zigbee
- Prijs: €399
- Features:
  * WiFi 6E
  * Zigbee + Thread
  * Matter ready
  * Open API
- Voordelen:
  * Zeer krachtig
  * Toekomstbestendig
  * Uitgebreide features
- Nadelen:
  * Hoge prijs
  * Overkill voor basis gebruik
  * Complex beheer

## Aanbeveling voor MantelzorgConnect

### Kleine Installaties (<5 apparaten)
**SONOFF ZBBridge-P**
- Voordelen:
  * Kosteneffectief
  * Eenvoudige setup
  * All-in-one oplossing
- Use case:
  * Enkele sensoren
  * Basis monitoring
  * Beperkt budget

### Middelgrote Installaties (5-20 apparaten)
**Huawei WiFi AX3 Pro**
- Voordelen:
  * Goede prijs/kwaliteit
  * Dual-purpose
  * Betrouwbaar
- Use case:
  * Meerdere sensoren
  * WiFi + Zigbee
  * Gemiddeld budget

### Grote Installaties (20+ apparaten)
**Homatics Box + ConBee II**
- Voordelen:
  * Maximale flexibiliteit
  * Beste performance
  * Toekomstbestendig
- Use case:
  * Veel sensoren
  * Professioneel gebruik
  * Uitgebreide monitoring

## Integratie met MantelzorgConnect

### API Integratie
```typescript
interface ZigbeeDevice {
    type: 'android-box' | 'router';
    model: string;
    apiEndpoint: string;
    capabilities: string[];
}

interface ZigbeeConfig {
    coordinator: ZigbeeDevice;
    networkKey: string;
    channel: number;
    panId: number;
}
```

### Configuratie Voorbeelden

1. SONOFF ZBBridge-P:
```json
{
    "type": "android-box",
    "model": "zbbridge-p",
    "apiEndpoint": "http://192.168.1.100:8080",
    "capabilities": ["coordinator", "media"]
}
```

2. Huawei Router:
```json
{
    "type": "router",
    "model": "ax3-pro",
    "apiEndpoint": "http://192.168.1.1/api",
    "capabilities": ["coordinator", "network"]
}
```

## Setup Instructies

### Android TV Box Setup
1. Box installatie
2. Zigbee configuratie
3. API activatie
4. Netwerk setup

### Router Setup
1. Firmware update
2. Zigbee activatie
3. API toegang
4. Netwerk config

## Onderhoud

### Updates
- Firmware checks
- Security patches
- API updates
- Feature upgrades

### Monitoring
- Device status
- Network health
- API performance
- Error logging

## Support

### Documentatie
- Setup guides
- API docs
- Troubleshooting
- Best practices

### Contact
- Hardware support
- API support
- Integration help
- Updates info