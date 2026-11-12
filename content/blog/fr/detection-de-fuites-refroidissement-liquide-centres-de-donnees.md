---
id: liquid-cooling
slug: detection-de-fuites-refroidissement-liquide-centres-de-donnees
title: Comment détecter une fuite dans un centre de données à refroidissement liquide avant la panne ?
description: Les câbles détecteurs au sol se déclenchent une fois l'eau au sol. La mesure de débit à pince par rack voit l'écart dans la boucle elle-même. Comment le modèle qui surveille les colonnes montantes surveille une boucle de refroidissement.
date: 2026-10-29
updated: 2026-10-29
author: Paul Beckers
authorId: paul-beckers
segment: data-centers
segmentLabel: Centres de données
coverAlt: Une rangée de racks de serveurs en perspective, avec une ligne de refroidissement lumineuse qui alimente chaque rack.
answer: En surveillant la boucle de refroidissement elle-même plutôt que le sol en dessous. Des capteurs de débit ultrasoniques à pince sur la dérivation de chaque rack apprennent le normal de la boucle et signalent un débit qui ne correspond plus à celui des dérivations voisines, avant que suffisamment de liquide se soit échappé pour atteindre un câble détecteur.
statValue: 10 minutes
statLabel: entre deux mesures sur chaque point de mesure AquaShield, la même cadence sur une colonne montante et sur une boucle de refroidissement.
statSource: AquaShield
statDate: 2026
definition: Un câble détecteur de fuite est un câble posé au sol qui ferme un circuit quand un liquide le touche. Il détecte un liquide qui a déjà quitté la boucle et atteint le sol.
faq1q: Les capteurs touchent-ils le liquide de refroidissement ?
faq1a: Non. Ils se fixent à pince sur l'extérieur des tuyaux de la boucle et mesurent à travers la paroi. Rien n'est découpé dans la boucle de refroidissement.
faq2q: Est-ce compatible avec la supervision propre de la boucle ?
faq2a: Oui. Le contrôleur de la boucle surveille les températures et l'état des pompes. AquaShield surveille le débit par dérivation et apprend à quoi ressemble le normal pour chacune, ce qui est un signal différent.
faq3q: Où cela fonctionne-t-il aujourd'hui ?
faq3a: Les capteurs et le modèle surveillent aujourd'hui des colonnes montantes résidentielles, en Allemagne et aux États-Unis. Premiers sites de centres de données en Suisse.
---
## Le problème du sol

Le refroidissement liquide fait circuler de l'eau ou un liquide de refroidissement dans une boucle jusqu'à chaque rack. La méthode habituelle pour détecter une fuite est un câble posé au sol qui réagit à l'humidité. Cela fonctionne, au sens où il se déclenche. Mais il se déclenche après que le liquide a quitté la boucle, coulé le long du rack et atteint le sol. À ce moment-là, un rack a perdu son refroidissement et le compte à rebours de la panne a commencé.

Pour un responsable d'exploitation, l'eau n'est pas le problème. La panne, oui.

## Surveiller la boucle plutôt que le sol

La physique qui trouve un raccord qui suinte sur une colonne montante résidentielle trouve un raccord qui suinte sur une dérivation de refroidissement. Des capteurs ultrasoniques à pince mesurent le débit à travers la paroi du tuyau, sur chaque dérivation ainsi que sur l'aller et le retour. Chacun envoie une mesure toutes les 10 minutes. Rien n'est découpé dans la boucle et rien ne touche le liquide de refroidissement.

Un modèle par point de mesure apprend le normal de la boucle : à quoi ressemble le débit de chaque dérivation à chaque niveau de charge, et comment les dérivations s'additionnent pour donner le débit de l'aller et du retour. Un écart est un schéma que le normal n'explique pas : une dérivation dont le débit ne correspond plus à celui de ses voisines sous la même charge, un débit de retour qui passe sous celui de l'aller sans changement de pompage.

## Par rack, pas par salle

Un câble détecteur vous dit que la salle a une fuite. La mesure par dérivation vous dit quel rack. Le jumeau numérique qui modélise les colonnes montantes d'un bâtiment modélise une boucle de refroidissement de la même façon : aller, retour, dérivations, quel capteur voit quel liquide. Quand la dérivation 3 s'écarte et pas les autres, l'alerte nomme le rack 3.

## Des colonnes montantes résidentielles au refroidissement liquide

Les capteurs et le modèle sont ceux qui surveillent aujourd'hui des colonnes montantes résidentielles, dans un parc de 22 bâtiments en Allemagne et sur des sites en Californie. La topologie diffère dans un centre de données, la méthode est la même. Premiers sites en Suisse.

## À quoi ressemble un premier site ?

Un premier site est volontairement petit.

1. **Une boucle, une rangée de racks.** Assez de dérivations pour montrer la localisation par rack, assez petit pour être installé en une journée.
2. **Fixer.** Des capteurs de débit sur chaque dérivation ainsi que sur l'aller et le retour. Sans découpe, sans contact avec le liquide, sans modification du contrôleur de la boucle.
3. **Apprendre.** Les modèles apprennent le normal de la boucle sous les charges réelles de la rangée, ce qui prend les premières semaines.
4. **Détecter.** L'équipe d'exploitation voit les premières alertes sur ses propres racks, avec la dérivation nommée, et décide à partir de là.

La question à laquelle répond un premier site n'est pas de savoir si la physique fonctionne. Elle fonctionne aujourd'hui sur des colonnes montantes résidentielles. La question est ce que valent les alertes pour ce site, et la réponse se trouve sur ses propres racks.

Le point d'entrée est une boucle de refroidissement et une rangée de racks. Les capteurs se fixent, le jumeau cartographie la boucle, le modèle apprend son normal, et l'équipe d'exploitation voit les premières alertes sur ses propres racks. Consultez la [page Centres de données](/fr/centres-de-donnees/), ou [réservez un appel de 30 minutes](/fr/reserver-un-appel/?for=data-centers).
