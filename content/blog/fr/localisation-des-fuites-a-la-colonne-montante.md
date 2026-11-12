---
id: riser-level
slug: localisation-des-fuites-a-la-colonne-montante
title: Que signifie la localisation des fuites à la colonne montante ?
description: La détection dit que quelque chose ne va pas. La localisation dit où. Comment AquaShield ramène un écart à la colonne montante et aux étages à vérifier en premier.
date: 2026-10-08
updated: 2026-10-08
author: Marguerite Benoist
authorId: marguerite-benoist
segment: product
segmentLabel: Produit
coverAlt: Des colonnes montantes verticales qui s'éloignent en profondeur, avec un tronçon allumé entre deux étages.
answer: La localisation à la colonne montante signifie que l'alerte nomme la colonne montante, et les étages de cette colonne, où se trouve l'écart. La détection dit que l'eau va là où elle ne devrait pas. La localisation dit quel tuyau vertical et quelle partie du bâtiment, pour que la recherche commence là plutôt que derrière le premier mur humide.
statValue: 32 points de mesure
statLabel: sur 22 bâtiments dans le premier parc AquaShield, en service depuis mars 2026.
statSource: Sites AquaShield
statDate: 2026
definition: Une colonne montante est le tuyau vertical qui monte l'eau à travers un bâtiment et alimente les dérivations de chaque étage. La plupart des bâtiments en ont plusieurs. Localiser à la colonne montante signifie que l'alerte indique laquelle.
faq1q: Pourquoi ne pas localiser au tronçon de tuyau exact ?
faq1a: Les capteurs sont sur les colonnes montantes et les conduites d'alimentation, pas sur chaque tronçon. Le jumeau raisonne à partir de ce qu'ils voient, ce qui suffit pour nommer la colonne montante et les étages. À partir de là, l'équipe trouve le tronçon sur site.
faq2q: Plus de capteurs, est-ce une meilleure localisation ?
faq2a: Oui. Chaque point de mesure ajouté divise davantage le réseau, donc un écart peut être placé dans une section plus petite. Le jumeau montre où un capteur de plus aiderait le plus.
faq3q: Que reçoit l'équipe de maintenance ?
faq3a: Le bâtiment, la colonne montante, l'écart du débit par rapport au normal et sa durée, et ce qu'il faut vérifier en premier.
---
## La détection n'est pas la localisation

De nombreux systèmes peuvent vous dire qu'un bâtiment consomme plus d'eau qu'il ne devrait. C'est de la détection, et à elle seule elle lance une recherche dans tout le bâtiment. La localisation est la partie qui rend l'alerte utile : elle dit à l'équipe où aller.

## Comment raisonne le jumeau ?

Le jumeau numérique d'AquaShield sait quel capteur voit quelle eau. Un capteur au pied d'une colonne montante voit tout ce qui se trouve au-dessus. Un capteur de dérivation au 3e étage ne voit que cet étage. Quand la colonne montante montre un écart et que la dérivation du 3e étage n'en montre pas, l'eau en trop se trouve sur la colonne montante elle-même ou à un étage sans capteur propre. Quand la dérivation du 3e étage le montre aussi, l'écart se trouve sur cette dérivation ou en aval.

Ce raisonnement tourne pour chaque point de mesure, toutes les 10 minutes. Le résultat est une colonne montante et une plage d'étages, classées selon la façon dont chacune explique les données.

## Que dit l'alerte ?

Un exemple issu des sites où AquaShield est en service, anonymisé : bâtiment 14, colonne montante B. Débit 38 pour cent au-dessus du profil normal de nuit pendant six heures. À vérifier en premier : colonne montante B, étages 3 à 5, vanne d'arrêt au 3e étage. Examinée avec l'équipe de maintenance.

Chaque élément a un rôle. Le bâtiment et la colonne montante disent où. Le pourcentage et la durée disent la gravité. La ligne "à vérifier en premier" dit quoi faire pendant les dix premières minutes sur site.

## Pourquoi la colonne montante est le bon niveau

Une colonne montante dessert une pile de logements. Ramener une fuite à une colonne montante et à trois étages transforme une recherche dans tout le bâtiment en une visite d'une seule gaine. L'équipe ouvre la bonne trappe de visite plutôt que le mauvais mur. La réparation elle-même ne change pas : un plombier et une pièce. Ce qui change, c'est le temps qu'il faut pour amener le plombier au bon endroit.

## D'où vient la précision ?

Deux choses affinent la localisation avec le temps. Plus de points de mesure divisent le réseau en sections plus petites. Et chaque incident dont le modèle apprend précise à quoi ressemble un écart sur cette colonne montante. Le jumeau montre où un capteur de plus aiderait le plus, pour qu'un parc puisse ajouter de la précision là où elle compte.

## Ce qui change le jour d'une alerte

Sans localisation, une alerte qui dit "le bâtiment consomme trop d'eau" lance un processus que l'équipe de maintenance connaît bien : parcourir le sous-sol, vérifier les raccords évidents, attendre une tache. Avec la localisation à la colonne montante, la première heure se passe autrement.

1. L'alerte nomme la colonne montante B et les étages 3 à 5. L'équipe ouvre l'accès à la gaine au 3e étage, pas le plafond sous la première tache.
2. La ligne "à vérifier en premier" nomme la vanne d'arrêt du 3e étage. Si le raccord est trouvé, le tronçon de colonne montante est isolé en quelques minutes et les logements du dessus ont un service réduit pendant un après-midi plutôt qu'une semaine.
3. Le résultat revient dans le système. Si la source était au 4e étage, le modèle apprend à quoi ressemble un écart du 4e étage sur cette colonne montante.

La réparation ne change pas. C'est la recherche qui se réduit.

Découvrez [comment AquaShield fonctionne](/fr/produit/), ou [réservez un appel de 30 minutes](/fr/reserver-un-appel/).
