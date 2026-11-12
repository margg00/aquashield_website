---
id: digital-twin
slug: was-ist-ein-digitaler-zwilling-der-rohrinstallation
title: Was ist ein digitaler Zwilling der Rohrinstallation eines Gebäudes?
description: Ein Modell der Steigleitungen, Abzweige und Sensoren, das aus einer Durchflussabweichung einen Ort macht, den man zuerst prüft. Was er enthält, wie er gebaut wird und wofür er da ist.
date: 2026-09-10
updated: 2026-09-10
author: Marguerite Benoist
authorId: marguerite-benoist
segment: product
segmentLabel: Produkt
coverAlt: Isometrisches Drahtgittermodell eines mehrstöckigen Gebäudes mit drei leuchtenden Steigleitungen und einer hervorgehobenen Messstelle.
answer: Ein digitaler Zwilling der Rohrinstallation eines Gebäudes ist ein Modell der Steigleitungen, Abzweige und Messstellen, und davon, welcher Sensor welches Wasser sieht. AquaShield baut ihn aus den Sensorpositionen und dem Leitungsplan. Seine Aufgabe ist, aus einer Abweichung an einem Sensor die Steigleitung und die zuerst zu prüfenden Stockwerke zu machen.
statValue: 23 Sensoren an 10 Steigleitungen
statLabel: in einem neuen siebenstöckigen Wohngebäude in Kalifornien, live mit AquaShield.
statSource: AquaShield-Standorte
statDate: 2026
definition: Ein digitaler Zwilling ist ein Softwaremodell eines physischen Systems, das mit diesem im Gleichschritt gehalten wird. Bei der Rohrinstallation enthält das Modell die Netztopologie (welches Rohr welches versorgt) und die Live-Messwerte der Sensoren darauf.
faq1q: Braucht es die originalen Leitungspläne?
faq1a: Sie helfen, und die meisten Gebäude haben sie. Wo Pläne fehlen, wird der Zwilling aus den Sensorpositionen und einem einzigen Rundgang entlang der Steigleitungen gebaut.
faq2q: Wie genau ist die Ortung?
faq2a: Bis zur Steigleitung oder zum Gebäudeabschnitt. Der Zwilling sagt der Haustechnik, welche Steigleitung und welche Stockwerke zuerst zu prüfen sind, damit die Suche am richtigen Ort beginnt.
faq3q: Ändert sich der Zwilling, wenn sich das Gebäude ändert?
faq3a: Ja. Eine Renovation, ein neuer Abzweig oder ein versetzter Sensor wird im Zwilling nachgeführt, und das Modell lernt den Normalverlauf für die betroffenen Messstellen neu.
---
## Warum ein Modell der Rohre

Ein Sensor sieht das Wasser, das an ihm vorbeifliesst. Ein Steigleitungssensor im Erdgeschoss sieht das Wasser für jedes Stockwerk darüber. Ein Abzweigsensor sieht ein Stockwerk. Meldet der Steigleitungssensor mehr Durchfluss als normal und der Abzweigsensor im 3. OG nicht, fliesst das zusätzliche Wasser an anderer Stelle der Steigleitung ab. Für diese Schlussfolgerung braucht es eine Karte davon, wer was sieht. Der digitale Zwilling ist diese Karte.

## Was der Zwilling enthält

Drei Dinge.

1. **Topologie.** Steigleitungen, Abzweige, Versorgungsleitungen und was welches versorgt. Das stammt aus dem Leitungsplan und den Sensorpositionen.
2. **Messstellen.** Wo jeder Clamp-on-Durchflusssensor in der Topologie sitzt, und damit, welches Wasser er sieht.
3. **Zustand.** Die Live-Messwerte und der gelernte Normalverlauf jeder Messstelle, aktualisiert alle 10 Minuten.

Der Zwilling ist keine 3D-Darstellung, auch wenn er sich als solche zeichnen lässt. Er ist ein Graph mit Zahlen darauf.

## Wie AquaShield den Zwilling baut

Der Zwilling entsteht aus zwei Eingaben: dem Leitungsplan und den Sensorpositionen. Ein Portfolio sendet den Plan oder führt uns einmal entlang der Steigleitungen, und AquaShield platziert die Sensoren dort, wo sie am meisten sehen. Danach wird der Zwilling erzeugt, und die Modelle beginnen, den Normalverlauf zu lernen. In einem neuen siebenstöckigen Wohngebäude in Kalifornien reichten 23 Sensoren an 10 Steigleitungen, um das Gebäude abzudecken.

## Wofür der Zwilling da ist

Der Zwilling beantwortet die Frage, die auf jeden Alarm folgt: Wo schauen wir zuerst nach? Eine Abweichung an einer Steigleitung ohne passende Abweichung an einem Abzweig zeigt auf die Steigleitung selbst. Eine Abweichung an einem Abzweig zeigt auf dieses Stockwerk. Der Alarm nennt die Steigleitung und die zu prüfenden Stockwerke, und die Haustechnik geht dorthin, statt die Wand unter dem ersten Fleck zu öffnen.

Er beantwortet auch eine Frage aus der Planung: Wo würde ein weiterer Sensor am meisten bringen? Weil der Zwilling weiss, welches Wasser jeder Sensor sieht, kann er zeigen, welcher Teil des Netzes bisher nur aus der Ferne gesehen wird.

## Zwilling, Dashboard, Modell: Wer macht was?

Drei Begriffe tauchen zusammen auf und werden leicht verwechselt.

- Das **Modell** gibt es pro Messstelle. Es lernt den normalen Durchfluss und markiert Abweichungen. Über die Form des Gebäudes weiss es nichts.
- Den **Zwilling** gibt es pro Gebäude. Er kennt die Form: welche Steigleitung welche Stockwerke versorgt, welcher Sensor welches Wasser sieht. Er nimmt die Abweichungen des Modells und verortet sie.
- Das **Dashboard** ist das, was die Haustechnik sieht: jede Messstelle gegenüber ihrem Normalverlauf, die Alarmliste nach Schweregrad sortiert und zu jedem Alarm die Steigleitung und die Stockwerke aus dem Zwilling.

Das Modell findet, der Zwilling verortet, das Dashboard meldet. Ein Portfolio mit 22 Gebäuden hat 22 Zwillinge, 32 Modelle und ein Dashboard.

## Wie es weitergeht

Derselbe Zwilling, der eine Steigleitung im Wohngebäude abbildet, bildet einen Kühlkreislauf im Rechenzentrum ab: Vorlauf, Rücklauf, Abzweige pro Rack, Sensoren pro Abzweig. Die Topologie ist eine andere, die Methode ist dieselbe. Lesen Sie, [wie AquaShield funktioniert](/de/produkt/), oder [buchen Sie ein 30-minütiges Gespräch](/de/gespraech-buchen/).
