---
id: digital-twin
slug: jumeau-numerique-de-la-plomberie
title: Qu'est-ce que le jumeau numérique de la plomberie d'un bâtiment ?
description: Un modèle des colonnes montantes, des dérivations et des capteurs qui transforme un écart de débit en un endroit à vérifier en premier. Ce qu'il contient, comment il est construit et à quoi il sert.
date: 2026-09-10
updated: 2026-09-10
author: Marguerite Benoist
authorId: marguerite-benoist
segment: product
segmentLabel: Produit
coverAlt: Bâtiment de plusieurs étages en fil de fer isométrique, avec trois colonnes montantes lumineuses et un point de mesure mis en évidence.
answer: Le jumeau numérique de la plomberie d'un bâtiment est un modèle des colonnes montantes, des dérivations et des points de mesure, qui sait quel capteur voit quelle eau. AquaShield le construit à partir des positions des capteurs et du plan de plomberie. Son rôle est de transformer un écart sur un capteur en une colonne montante et des étages à vérifier en premier.
statValue: 23 capteurs sur 10 colonnes montantes
statLabel: dans un immeuble résidentiel neuf de sept étages en Californie, en service avec AquaShield.
statSource: Sites AquaShield
statDate: 2026
definition: Un jumeau numérique est un modèle logiciel d'un système physique, tenu en phase avec lui. Pour la plomberie, le modèle contient la topologie du réseau (quel tuyau alimente lequel) et les mesures en direct des capteurs qui y sont posés.
faq1q: Faut-il les plans de plomberie d'origine ?
faq1a: Ils aident, et la plupart des bâtiments en ont. Quand les plans manquent, le jumeau est construit à partir des positions des capteurs et d'un seul passage le long des colonnes montantes.
faq2q: Quelle est la précision de la localisation ?
faq2a: À la colonne montante ou à la section du bâtiment. Le jumeau indique à l'équipe quelle colonne montante et quels étages vérifier en premier, pour que la recherche commence au bon endroit.
faq3q: Le jumeau change-t-il quand le bâtiment change ?
faq3a: Oui. Une rénovation, une nouvelle dérivation ou un capteur déplacé est mis à jour dans le jumeau, et le modèle réapprend le normal pour les points de mesure concernés.
---
## Pourquoi un modèle des tuyaux ?

Un capteur voit l'eau qui passe devant lui. Un capteur de colonne montante au rez-de-chaussée voit l'eau de tous les étages au-dessus. Un capteur de dérivation voit un étage. Quand le capteur de la colonne montante indique un débit supérieur au normal et que celui de la dérivation du 3e étage ne le fait pas, l'eau en trop part ailleurs sur la colonne montante. Ce raisonnement demande une carte de qui voit quoi. Le jumeau numérique est cette carte.

## Que contient le jumeau ?

Trois choses.

1. **La topologie.** Les colonnes montantes, les dérivations, les conduites d'alimentation, et ce qui alimente quoi. Elle vient du plan de plomberie et des positions des capteurs.
2. **Les points de mesure.** L'emplacement de chaque capteur de débit à pince sur la topologie, et donc l'eau qu'il voit.
3. **L'état.** Les mesures en direct et le normal appris pour chaque point de mesure, mis à jour toutes les 10 minutes.

Le jumeau n'est pas un rendu 3D, même s'il peut être dessiné ainsi. C'est un graphe avec des chiffres dessus.

## Comment AquaShield le construit

Le jumeau est construit à partir de deux sources : le plan de plomberie et les positions des capteurs. Un parc envoie le plan, ou nous fait visiter les colonnes montantes une fois, et AquaShield place les capteurs là où ils voient le plus. À partir de là, le jumeau est généré et les modèles commencent à apprendre le normal. Dans un immeuble résidentiel neuf de sept étages en Californie, 23 capteurs sur 10 colonnes montantes ont suffi pour couvrir le bâtiment.

## À quoi sert-il ?

Le jumeau répond à la question qui suit chaque alerte : où regarder en premier ? Un écart sur une colonne montante sans écart correspondant sur une dérivation désigne la colonne montante elle-même. Un écart sur une seule dérivation désigne cet étage. L'alerte nomme la colonne montante et les étages à vérifier, et l'équipe de maintenance y va au lieu d'ouvrir le mur sous la première tache.

Il répond aussi à une question qui se pose lors de la planification : où un capteur de plus aiderait-il le plus ? Comme le jumeau sait quelle eau voit chaque capteur, il peut montrer quelle partie du réseau n'est encore vue que de loin.

## Jumeau, tableau de bord, modèle : qui fait quoi ?

Trois mots reviennent ensemble et se confondent facilement.

- Le **modèle** est propre à chaque point de mesure. Il apprend le débit normal et signale les écarts. Il ne sait rien de la forme du bâtiment.
- Le **jumeau** est propre à chaque bâtiment. Il connaît la forme : quelle colonne montante alimente quels étages, quel capteur voit quelle eau. Il prend les écarts du modèle et les place.
- Le **tableau de bord** est ce que voit l'équipe : chaque point de mesure face à son profil normal, la liste des alertes classées par gravité, et pour chaque alerte la colonne montante et les étages fournis par le jumeau.

Le modèle trouve, le jumeau place, le tableau de bord informe. Un parc de 22 bâtiments a 22 jumeaux, 32 modèles et un seul tableau de bord.

## Et ensuite ?

Le jumeau qui modélise une colonne montante résidentielle modélise aussi une boucle de refroidissement dans un centre de données : aller, retour, dérivations par rack, capteurs par dérivation. La topologie diffère, la méthode est la même. Découvrez [comment AquaShield fonctionne](/fr/produit/) ou [réservez un appel de 30 minutes](/fr/reserver-un-appel/).
