---
id: flow-baseline
slug: profil-normal-de-debit-ia
title: Qu'est-ce que le profil normal de débit, et comment l'IA l'apprend-elle pour un bâtiment ?
description: Chaque colonne montante a son rythme. Un modèle par point de mesure l'apprend par pas de 10 minutes, et une fuite est ce que ce rythme n'explique pas. Comment fonctionne l'apprentissage et pourquoi il est propre aux systèmes hydrauliques.
date: 2026-08-13
updated: 2026-08-13
author: Marguerite Benoist
authorId: marguerite-benoist
segment: product
segmentLabel: Produit
coverAlt: Une bande lumineuse qui représente le débit d'eau normal d'une journée, avec une ligne de mesure en direct qui la suit et se termine par un point brillant.
answer: Le profil normal de débit est le schéma de débit qu'un point de mesure montre quand tout fonctionne : faible la nuit, un pic le matin, un rythme hebdomadaire. AquaShield l'apprend pour chaque point de mesure à partir d'une mesure toutes les 10 minutes. Un écart est un débit que le profil normal n'explique pas, et c'est à cela que ressemble une fuite dans les données.
statValue: 144
statLabel: mesures par point de mesure et par jour, une toutes les 10 minutes, sur chaque site AquaShield.
statSource: AquaShield
statDate: 2026
definition: Un profil normal (ou ligne de base) n'est pas un chiffre unique. C'est le débit attendu pour chaque heure de la journée et chaque jour de la semaine, avec la dispersion normale autour. Un débit dans cette dispersion est normal. Un débit en dehors, assez longtemps, est un écart.
faq1q: Pourquoi un modèle par point de mesure ?
faq1a: Parce que chaque colonne montante a son propre rythme. Une colonne montante qui dessert des logements familiaux atteint son pic à d'autres heures qu'une colonne montante qui dessert des bureaux. Un seul modèle pour tout le bâtiment les mélangerait et manquerait les petits écarts lents qui comptent.
faq2q: Qu'est-ce qui le rend propre aux systèmes hydrauliques ?
faq2a: L'eau dans les tuyaux suit des règles physiques : le débit et la topologie sont liés, et l'eau qui entre dans une colonne montante doit sortir par ses dérivations. Le modèle et le jumeau numérique utilisent ces liens, qu'un détecteur d'anomalies générique ignore.
faq3q: Le modèle continue-t-il d'apprendre ?
faq3a: Oui. Le normal évolue avec les saisons et l'occupation, et le modèle le suit. Les retours de l'équipe de maintenance sur chaque alerte reviennent dans le modèle.
---
## Chaque colonne montante a son rythme

Tenez-vous à côté d'une colonne montante résidentielle à 3 h du matin : l'eau est presque immobile. À 7 h, elle circule fort. Le dimanche, le pic du matin arrive plus tard. Sur une année, l'été et l'hiver diffèrent. Ce rythme est le profil normal, et c'est ce qu'un modèle doit connaître avant de pouvoir dire que quelque chose ne va pas.

## Comment est-il appris ?

Chaque point de mesure envoie une mesure toutes les 10 minutes, soit 144 par jour. À partir de ces mesures, un modèle par point de mesure construit le débit attendu pour chaque heure de la journée et chaque jour de la semaine, avec la dispersion normale autour. Cela prend les premières semaines après l'installation. Pendant ce temps, le système apprend et n'envoie pas d'alerte, car une alerte avant de connaître le normal serait une supposition.

Le modèle est propre à son point de mesure. Une colonne montante qui dessert des logements familiaux et une colonne montante qui dessert des bureaux dans le même bâtiment ont des profils normaux différents, et un modèle unique pour le bâtiment les mélangerait. Les petits écarts lents qui comptent le plus, comme un débit de nuit qui ne redescend plus à son niveau habituel, ne sont visibles que face au bon rythme.

## Qu'est-ce qu'un écart ?

Un écart est un débit que le profil normal n'explique pas, assez longtemps pour compter. Pas une seule mesure élevée, car les douches existent. Un schéma : un débit de nuit qui reste élevé, une dérivation qui coule quand ses voisines sont à l'arrêt, une colonne montante dont le débit ne correspond plus à la somme de ses dérivations. Le modèle classe les écarts par gravité, et le jumeau numérique les place sur la colonne montante et les étages à vérifier en premier.

## Pourquoi les systèmes hydrauliques ont besoin de leur propre apprentissage automatique

La détection d'anomalies générique traite chaque signal comme une suite de chiffres. L'eau dans les tuyaux n'est pas qu'une suite de chiffres. Le débit est physiquement lié d'un bout à l'autre du réseau, et la topologie dit quels capteurs doivent concorder. Les modèles d'AquaShield utilisent ces liens : un écart sur une colonne montante est confronté aux dérivations qu'elle alimente, et un changement sur une dérivation est confronté au débit de la colonne montante qui devrait l'expliquer. C'est ce qui permet au système de distinguer une fuite d'une longue douche.

## Apprendre avec l'équipe

Chaque alerte est examinée avec l'équipe de maintenance, et le résultat revient dans le modèle. Au fil des mois, le modèle de chaque point de mesure s'affine précisément sur les écarts qui comptent dans ce bâtiment.

## Ce que le profil normal n'est pas

Deux choses sont souvent confondues avec un profil normal.

- **Un seuil.** Une règle comme "alerte au-dessus de 500 litres par heure" ignore l'heure de la journée. À 7 h, c'est normal, à 3 h du matin, c'est une fuite. Un profil normal est un seuil qui suit le rythme.
- **Une moyenne.** Le débit moyen d'une colonne montante est un chiffre unique qu'elle n'affiche presque jamais. Le profil normal contient le débit attendu pour chaque créneau de la semaine, avec la dispersion autour, pour qu'un dimanche matin calme ne soit pas pris pour une vanne bloquée.

C'est pour bien faire cela que les premières semaines servent à apprendre plutôt qu'à alerter. Un système qui alerte dès le premier jour utilise un seuil, quel que soit le nom qu'il lui donne.

Découvrez [comment AquaShield fonctionne](/fr/produit/), ou [réservez un appel de 30 minutes](/fr/reserver-un-appel/).
