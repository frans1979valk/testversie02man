## MantelzorgConnect Tariefstructuur & Camera Integratie

### 1. Basis Abonnement

#### Standaard Pakket (€9,95/maand)
- VoIP bellen (€0,05/min lokaal, €0,10/min mobiel)
- SMS berichten (€0,09 per SMS)
- Noodknop functionaliteit
- Basis support
- App voor telefoon/tablet

#### Jaarlijks Pakket (€99,50/jaar)
- 15% korting op maandprijs
- Alle standaard functies
- Gratis setup (t.w.v. €25)

### 2. Camera & Deurbel Uitbreidingen

#### IP Camera Abonnement (€9,95/maand per camera)
- 24/7 toegang tot livestream
- Bewegingsdetectie
- 7 dagen opslag in de cloud
- Notificaties bij beweging
- Bekijken via app/web

#### Slimme Deurbel (€14,95/maand)
- Video intercom functie
- Bewegingsdetectie
- 14 dagen opslag
- Tweeweg audio
- Nachtzicht
- Push notificaties

### 3. Technische Implementatie Cameras

#### Opslag & Streaming
1. **Lokale Opslag**
   - NVR (Network Video Recorder) in het netwerk
   - 7-14 dagen retentie
   - Automatische cleanup
   - Backup naar cloud

2. **Cloud Opslag**
   - Amazon S3 voor langetermijnopslag
   - End-to-end encryptie
   - Geografisch redundant
   - Automatische archivering

#### Verbinding & Integratie
1. **Camera Setup**
   - Vast IP adres in lokaal netwerk
   - Poort forwarding voor externe toegang
   - RTSP stream voor live video
   - ONVIF protocol voor beheer

2. **Deurbel Integratie**
   ```
   [Deurbel] → [Lokaal Netwerk] → [MantelzorgConnect Server]
                                → [Cloud Opslag]
                                → [App Notificatie]
   ```

3. **Streaming Protocol**
   - RTSP voor lokaal netwerk
   - WebRTC voor live viewing
   - HLS voor cloud playback
   - Adaptieve bitrate

### 4. Aanbevolen Hardware

#### IP Camera's
1. **Reolink E1 Pro**
   - 4MP kwaliteit
   - Pan/Tilt functie
   - Nachtzicht
   - Prijs: €59,95

2. **Hikvision DS-2CD2143G2-I**
   - 4MP kwaliteit
   - Professionele kwaliteit
   - ONVIF compatibel
   - Prijs: €129,95

#### Video Deurbellen
1. **Reolink Video Doorbell PoE**
   - 5MP kwaliteit
   - PoE aansluiting
   - Bewegingsdetectie
   - Prijs: €149,95

2. **Hikvision DS-KV6113-WPE1**
   - Professionele kwaliteit
   - WiFi of PoE
   - Vandaalbestendig
   - Prijs: €199,95

### 5. Dataflow & Opslag

#### Live Viewing
```
[Camera] → RTSP → [Lokale Server] → WebRTC → [App/Web Interface]
```

#### Opname & Opslag
```
[Camera] → RTSP → [NVR/Server] → [Lokale Opslag]
                              → [Cloud Backup]
                              → [Archief]
```

#### Notificaties
```
[Bewegingsdetectie] → [Server] → [Push Notificatie]
                              → [SMS/Email Alert]
                              → [Mantelzorger App]
```

### 6. Privacy & Beveiliging

#### Data Bescherming
- End-to-end encryptie
- Toegangscontrole per camera
- Audit logging
- GDPR compliant

#### Retentiebeleid
- Live beelden: Real-time
- Normale opnames: 7 dagen
- Gebeurtenissen: 14 dagen
- Noodgevallen: 30 dagen

### 7. Kortingen & Bundels

#### Multi-Camera Korting
- 2 camera's: 10% korting
- 3+ camera's: 15% korting
- 5+ camera's: 20% korting

#### Jaarlijkse Betaling
- 15% korting op alle diensten
- Gratis installatie
- Premium support

### 8. Support & Service

#### Installatie
- Professionele montage
- Netwerk configuratie
- App setup
- Gebruikerstraining

#### Onderhoud
- 24/7 monitoring
- Automatische updates
- Preventief onderhoud
- Backup verificatie

### 9. Voorbeeld Configuraties

#### Basis Setup
- 1 IP camera
- Basis abonnement
- Totaal: €19,90/maand

#### Complete Setup
- 1 IP camera
- 1 video deurbel
- Basis abonnement
- Totaal: €34,85/maand

#### Premium Setup
- 2 IP camera's
- 1 video deurbel
- Basis abonnement
- 10% multi-camera korting
- Totaal: €42,31/maand