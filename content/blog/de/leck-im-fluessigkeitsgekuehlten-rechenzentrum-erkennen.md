---
id: liquid-cooling
slug: leck-im-fluessigkeitsgekuehlten-rechenzentrum-erkennen
title: Wie erkennen Sie ein Leck im flüssigkeitsgekühlten Rechenzentrum vor dem Ausfall?
description: Leckagekabel am Boden schlagen erst an, wenn das Wasser schon auf dem Boden ist. Clamp-on-Durchflussmessung pro Rack sieht die Abweichung im Kreislauf selbst. Wie dasselbe Modell, das Steigleitungen überwacht, einen Kühlkreislauf überwacht.
date: 2026-10-29
updated: 2026-10-29
author: Paul Beckers
authorId: paul-beckers
segment: data-centers
segmentLabel: Rechenzentren
coverAlt: Eine Reihe von Server-Racks in Perspektive, eine leuchtende Kühlmittelleitung versorgt jedes Rack.
answer: Indem Sie den Kühlkreislauf selbst überwachen statt des Bodens darunter. Clamp-on-Ultraschall-Durchflusssensoren am Abzweig zu jedem Rack lernen den Normalverlauf des Kreislaufs und melden einen Durchfluss, der nicht mehr zu seinen Nachbarn passt, bevor genug Flüssigkeit ausgetreten ist, um ein Leckagekabel zu erreichen.
statValue: 10 Minuten
statLabel: zwischen zwei Messwerten an jeder AquaShield-Messstelle, derselbe Takt an einer Steigleitung und an einem Kühlkreislauf.
statSource: AquaShield
statDate: 2026
definition: Ein Leckagekabel ist ein Sensorkabel am Boden, das einen Stromkreis schliesst, sobald Flüssigkeit es berührt. Es erkennt Flüssigkeit, die den Kreislauf bereits verlassen und den Boden erreicht hat.
faq1q: Berühren die Sensoren das Kühlmittel?
faq1a: Nein. Sie werden aussen an die Rohre des Kreislaufs geklemmt und messen durch die Wand. Nichts wird in den Kühlkreislauf geschnitten.
faq2q: Funktioniert das zusammen mit der Überwachung des Kreislaufs selbst?
faq2a: Ja. Die Steuerung des Kreislaufs überwacht Temperaturen und Pumpenzustand. AquaShield überwacht den Durchfluss pro Abzweig und lernt, wie normal für jeden einzelnen aussieht. Das ist ein anderes Signal.
faq3q: Wo läuft das heute?
faq3a: Die Sensoren und das Modell überwachen heute Steigleitungen in Wohngebäuden, in Deutschland und den USA. Erste Rechenzentrumsstandorte in der Schweiz.
---
## Das Problem mit dem Boden

Flüssigkeitskühlung führt Wasser oder Kühlmittel in einem Kreislauf zu jedem Rack. Der übliche Weg, ein Leck zu erkennen, ist ein Kabel am Boden, das auf Feuchtigkeit reagiert. Es funktioniert, in dem Sinne, dass es anschlägt. Aber es schlägt an, nachdem die Flüssigkeit den Kreislauf verlassen hat, am Rack heruntergelaufen ist und den Boden erreicht hat. Bis dahin hat ein Rack seine Kühlung verloren, und die Uhr bis zum Ausfall läuft.

Für Facility-Verantwortliche ist nicht das Wasser das Problem. Sondern der Ausfall.

## Den Kreislauf überwachen statt des Bodens

Dieselbe Physik, die eine undichte Verbindung an einer Steigleitung im Wohnhaus findet, findet eine undichte Verbindung an einem Kühlabzweig. Clamp-on-Ultraschallsensoren messen den Durchfluss durch die Rohrwand, an jedem Abzweig sowie an Vorlauf und Rücklauf. Jeder meldet alle 10 Minuten. Nichts wird in den Kreislauf geschnitten, und nichts berührt das Kühlmittel.

Ein Modell pro Messstelle lernt den Normalverlauf des Kreislaufs: wie der Durchfluss an jedem Abzweig bei jeder Last aussieht und wie sich die Abzweige zum Durchfluss in Vorlauf und Rücklauf summieren. Eine Abweichung ist ein Muster, das der Normalverlauf nicht erklärt: ein Abzweig, dessen Durchfluss bei gleicher Last nicht mehr zu seinen Nachbarn passt, ein Rücklauf, der ohne Änderung der Pumpenleistung unter den Vorlauf absinkt.

## Pro Rack, nicht pro Raum

Ein Leckagekabel sagt Ihnen, dass der Raum ein Leck hat. Die Messung pro Abzweig sagt Ihnen, welches Rack. Der digitale Zwilling, der die Steigleitungen eines Gebäudes abbildet, bildet einen Kühlkreislauf auf dieselbe Weise ab: Vorlauf, Rücklauf, Abzweige, welcher Sensor welches Kühlmittel sieht. Weicht Abzweig 3 ab und die anderen nicht, nennt der Alarm Rack 3.

## Von der Steigleitung zur Flüssigkeitskühlung

Die Sensoren und das Modell sind dieselben, die heute Steigleitungen in Wohngebäuden überwachen, in einem Portfolio mit 22 Gebäuden in Deutschland und an Standorten in Kalifornien. Die Topologie in einem Rechenzentrum ist eine andere, die Methode ist dieselbe. Erste Standorte in der Schweiz.

## So sieht ein erster Standort aus

Ein erster Standort ist bewusst klein.

1. **Ein Kreislauf, eine Rack-Reihe.** Genug Abzweige, um die Ortung pro Rack zu zeigen, klein genug, um an einem Tag installiert zu werden.
2. **Anklemmen.** Durchflusssensoren an jedem Abzweig sowie an Vorlauf und Rücklauf. Kein Schneiden, kein Kontakt mit dem Kühlmittel, keine Änderung an der Steuerung des Kreislaufs.
3. **Lernen.** Die Modelle lernen den Normalverlauf des Kreislaufs unter den Lasten, die die Reihe tatsächlich sieht. Das dauert die ersten Wochen.
4. **Erkennen.** Das Facility-Team sieht die ersten Alarme an seinen eigenen Racks, mit dem benannten Abzweig, und entscheidet von dort aus.

Die Frage, die ein erster Standort beantwortet, ist nicht, ob die Physik funktioniert. Das tut sie heute an Steigleitungen in Wohngebäuden. Die Frage ist, was die Alarme dieser Anlage wert sind, und die Antwort kommt von den eigenen Racks.

Der Einstieg ist ein Kühlkreislauf und eine Rack-Reihe. Die Sensoren werden angeklemmt, der Zwilling bildet den Kreislauf ab, das Modell lernt seinen Normalverlauf, und das Facility-Team sieht die ersten Alarme an seinen eigenen Racks. Mehr auf der [Seite für Rechenzentren](/de/rechenzentren/), oder [buchen Sie ein 30-minütiges Gespräch](/de/gespraech-buchen/?for=data-centers).
