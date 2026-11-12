---
id: flow-baseline
slug: was-ist-eine-durchfluss-baseline
title: Was ist eine Durchfluss-Baseline und wie lernt KI sie für ein Gebäude?
description: Jede Steigleitung hat einen Rhythmus. Ein Modell pro Messstelle lernt ihn in 10-Minuten-Schritten, und ein Leck ist das, was dieser Rhythmus nicht erklärt. Wie das Lernen funktioniert und warum es auf hydraulische Systeme zugeschnitten ist.
date: 2026-08-13
updated: 2026-08-13
author: Marguerite Benoist
authorId: marguerite-benoist
segment: product
segmentLabel: Produkt
coverAlt: Ein leuchtendes Band des normalen täglichen Wasserdurchflusses, darin eine Live-Messkurve, die in einem hellen Punkt endet.
answer: Eine Durchfluss-Baseline, auch Normalverlauf genannt, ist das Durchflussmuster, das eine Messstelle zeigt, wenn alles funktioniert: niedrig in der Nacht, eine Spitze am Morgen, ein Wochenrhythmus. AquaShield lernt sie pro Messstelle aus Messwerten alle 10 Minuten. Eine Abweichung ist ein Durchfluss, den die Baseline nicht erklärt, und genau so sieht ein Leck in den Daten aus.
statValue: 144
statLabel: Messwerte pro Messstelle und Tag, einer alle 10 Minuten, an jedem AquaShield-Standort.
statSource: AquaShield
statDate: 2026
definition: Eine Baseline ist keine einzelne Zahl. Sie ist der erwartete Durchfluss für jede Tageszeit und jeden Wochentag, mit der normalen Streuung darum herum. Durchfluss innerhalb dieser Streuung ist normal. Durchfluss ausserhalb davon, lange genug, ist eine Abweichung.
faq1q: Warum ein Modell pro Messstelle?
faq1a: Weil jede Steigleitung ihren eigenen Rhythmus hat. Eine Steigleitung für Familienwohnungen hat ihre Spitzen zu anderen Zeiten als eine für Büros. Ein Modell für das ganze Gebäude würde beides vermischen und die kleinen, langsamen Abweichungen übersehen, auf die es ankommt.
faq2q: Was macht es spezifisch für hydraulische Systeme?
faq2a: Wasser in Rohren folgt physikalischen Regeln: Durchfluss und Topologie hängen zusammen, und das Wasser, das in eine Steigleitung fliesst, muss sie über ihre Abzweige wieder verlassen. Das Modell und der digitale Zwilling nutzen diese Zusammenhänge, die ein generischer Anomaliedetektor nicht kennt.
faq3q: Lernt das Modell weiter?
faq3a: Ja. Der Normalverlauf verschiebt sich mit Jahreszeiten und Belegung, und das Modell folgt ihm. Das Feedback der Haustechnik zu jedem Alarm fliesst zurück ins Modell.
---
## Jede Steigleitung hat einen Rhythmus

Stehen Sie um 3 Uhr nachts neben einer Steigleitung in einem Wohnhaus, steht das Wasser fast still. Um 7 Uhr morgens fliesst es kräftig. Am Sonntag kommt die Morgenspitze später. Über das Jahr unterscheiden sich Sommer und Winter. Dieser Rhythmus ist die Baseline, und ein Modell muss sie kennen, bevor es sagen kann, dass etwas nicht stimmt.

## Wie die Baseline gelernt wird

Jede Messstelle liefert alle 10 Minuten einen Messwert, 144 pro Tag. Aus diesen Messwerten baut ein Modell pro Messstelle den erwarteten Durchfluss für jede Tageszeit und jeden Wochentag auf, zusammen mit der normalen Streuung darum herum. Das dauert die ersten Wochen nach der Installation. In dieser Zeit lernt das System und meldet keine Alarme, denn ein Alarm, bevor der Normalverlauf bekannt ist, wäre eine Vermutung.

Das Modell ist auf seine Messstelle zugeschnitten. Eine Steigleitung für Familienwohnungen und eine Steigleitung für Büros im selben Gebäude haben unterschiedliche Baselines, und ein einziges Modell für das Gebäude würde sie vermischen. Die langsamen, kleinen Abweichungen, auf die es am meisten ankommt, etwa ein nächtlicher Durchfluss, der nicht mehr auf sein übliches Niveau zurückgeht, sind nur vor dem richtigen Rhythmus sichtbar.

## Was ist eine Abweichung?

Eine Abweichung ist ein Durchfluss, den die Baseline nicht erklärt, und zwar lange genug, dass es zählt. Kein einzelner hoher Messwert, denn geduscht wird immer. Ein Muster: ein nächtlicher Durchfluss, der erhöht bleibt, ein Abzweig, der läuft, während seine Nachbarn stillstehen, eine Steigleitung, deren Durchfluss nicht mehr mit der Summe ihrer Abzweige übereinstimmt. Das Modell sortiert Abweichungen nach Schweregrad, und der digitale Zwilling verortet sie an der Steigleitung und den zuerst zu prüfenden Stockwerken.

## Warum hydraulische Systeme eigenes maschinelles Lernen brauchen

Generische Anomalieerkennung behandelt jedes Signal als Zahlenreihe. Wasser in Rohren ist nicht nur Zahlen. Der Durchfluss ist physikalisch über das Netz verknüpft, und die Topologie sagt, welche Sensoren miteinander übereinstimmen müssen. Die Modelle von AquaShield nutzen diese Verknüpfungen: Eine Abweichung an einer Steigleitung wird mit den Abzweigen abgeglichen, die sie versorgt, und eine Veränderung an einem Abzweig mit dem Durchfluss der Steigleitung, der sie erklären müsste. Deshalb kann das System ein Leck von einer langen Dusche unterscheiden.

## Lernen von der Haustechnik

Jeder Alarm wird mit der Haustechnik geprüft, und das Ergebnis fliesst zurück ins Modell. Über Monate wird das Modell jeder Messstelle genau bei den Abweichungen schärfer, die in diesem Gebäude zählen.

## Was die Baseline nicht ist

Zwei Dinge werden oft mit einer Baseline verwechselt.

- **Ein Schwellenwert.** Eine Regel wie "Alarm über 500 Liter pro Stunde" ignoriert die Tageszeit. Um 7 Uhr morgens ist das normal, um 3 Uhr nachts ist es ein Leck. Eine Baseline ist ein Schwellenwert, der sich mit dem Rhythmus bewegt.
- **Ein Durchschnitt.** Der durchschnittliche Durchfluss einer Steigleitung ist eine einzelne Zahl, die sie fast nie zeigt. Die Baseline enthält den erwarteten Durchfluss für jedes Zeitfenster der Woche, mit der Streuung darum herum, damit ein ruhiger Sonntagmorgen nicht für ein klemmendes Ventil gehalten wird.

Genau deshalb werden die ersten Wochen mit Lernen statt mit Alarmen verbracht. Ein System, das ab dem ersten Tag Alarme meldet, nutzt einen Schwellenwert, egal wie es ihn nennt.

Lesen Sie, [wie AquaShield funktioniert](/de/produkt/), oder [buchen Sie ein 30-minütiges Gespräch](/de/gespraech-buchen/).
