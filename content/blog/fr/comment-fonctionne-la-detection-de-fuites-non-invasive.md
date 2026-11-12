---
id: non-invasive
slug: comment-fonctionne-la-detection-de-fuites-non-invasive
title: Comment fonctionne la détection de fuites non invasive dans un bâtiment ?
description: Des capteurs ultrasoniques à pince lisent le débit à travers la paroi du tuyau, un modèle apprend le normal et un jumeau numérique place l'écart. Sans découpe de tuyau.
date: 2026-07-02
updated: 2026-07-02
author: Marguerite Benoist
authorId: marguerite-benoist
segment: product
segmentLabel: Produit
coverAlt: Deux capteurs à pince sur l'extérieur d'un tuyau, avec un trajet ultrasonore en V qui se réfléchit sur la paroi opposée.
answer: La détection de fuites non invasive lit l'eau depuis l'extérieur du tuyau. Un capteur de débit ultrasonique à pince se pose sur l'extérieur de la colonne montante et mesure le débit à travers la paroi, et un modèle par point de mesure apprend le débit normal du bâtiment. Une fuite apparaît comme un schéma que le normal n'explique pas.
statValue: Moins de 15 min
statLabel: par capteur, à pince, sans découpe de tuyau, l'eau reste ouverte, sur les sites AquaShield en service aujourd'hui.
statSource: Installations AquaShield
statDate: 2026
definition: Non invasif signifie que rien n'entre dans le tuyau. Le capteur est fixé à l'extérieur, envoie un signal ultrasonore à travers la paroi et l'eau, et déduit le débit de la façon dont l'eau modifie le signal. Le tuyau n'est jamais ouvert.
faq1q: Le capteur touche-t-il l'eau ?
faq1a: Non. Il se fixe à pince sur l'extérieur du tuyau et mesure à travers la paroi. Aucun contact avec l'eau et aucune modification de la plomberie.
faq2q: Est-ce que ça fonctionne sur des tuyaux isolés ?
faq2a: Oui. Une courte section d'isolation est ouverte à l'emplacement du capteur, puis refermée autour de lui. Le reste ne change pas.
faq3q: Et si la canalisation est ancienne ?
faq3a: Les capteurs se fixent sur toute canalisation accessible, ancienne ou récente. Le jumeau numérique est construit à partir des positions des capteurs et du plan de plomberie, donc l'âge du bâtiment ne compte pas.
---
## Lire l'eau à travers la paroi du tuyau

La méthode la plus ancienne pour mesurer un débit consiste à couper le tuyau et à y insérer un compteur. Cela demande un plombier, une coupure d'eau et un raccord qui peut lui-même fuir un jour. La mesure de débit par ultrasons évite tout cela. Deux transducteurs se posent sur l'extérieur du tuyau, légèrement décalés l'un par rapport à l'autre. L'un envoie une impulsion à travers la paroi et l'eau, l'autre la reçoit. L'eau qui va dans le sens de l'impulsion l'accélère, l'eau qui va en sens inverse la ralentit. La différence de temps de transit donne le débit.

Le capteur est fixé au tuyau par un collier. L'installation prend moins de 15 minutes. L'eau reste ouverte tout le temps, et les locataires ne remarquent rien.

## Un capteur, deux vues

AquaShield utilise une seule mesure, le débit, et la lit de deux façons complémentaires.

- **Le débit par colonne montante**, mesuré par des capteurs ultrasoniques à pince sur les colonnes montantes et les conduites d'alimentation. Le débit indique combien d'eau circule et quand.
- **Le débit à l'échelle du réseau**, en comparant les points de mesure. Le débit d'une colonne montante doit correspondre à celui des dérivations qu'elle alimente, donc le réseau dans son ensemble montre des changements qu'un capteur de débit seul ne voit pas toujours.

Chaque capteur envoie une mesure toutes les 10 minutes. Avec 32 points de mesure sur un parc, cela fait 4 608 mesures par jour pour un seul client.

## Le modèle apprend d'abord le normal

Une mesure seule ne dit pas grand-chose. À 3 h du matin, le débit d'une colonne montante résidentielle est faible, à 7 h il est élevé, et un dimanche ne ressemble pas à un mardi. Chaque point de mesure a donc son propre modèle, et la première chose que fait le modèle est d'apprendre à quoi ressemble le normal pour cette colonne montante : le profil normal de nuit, le pic du matin, le rythme de la semaine et du week-end.

Ensuite seulement, la détection commence. Un écart est un schéma de débit que le normal appris n'explique pas, par exemple un débit de nuit qui ne redescend plus à son niveau habituel. C'est à ce schéma que ressemble une fuite cachée, vue depuis l'extérieur du tuyau.

## Le jumeau numérique le place

Savoir que quelque chose ne va pas, c'est la moitié du travail. L'autre moitié, c'est savoir où. AquaShield construit un jumeau numérique de la plomberie du bâtiment à partir des positions des capteurs et du plan de plomberie : quelle colonne montante alimente quels étages, quel capteur voit quelle eau. Quand un écart apparaît, le jumeau le ramène à la colonne montante et aux étages à vérifier en premier. L'équipe de maintenance reçoit un endroit où aller, pas une tache à partir de laquelle remonter.

## Ce que cela change pour un parc

La mesure non invasive change l'économie de la surveillance. Sans découpe de tuyau, il n'y a ni plombier par capteur ni coupure d'eau par bâtiment. Une journée de pose couvre un bâtiment, le jumeau est construit le jour même, et le modèle apprend le normal au fil des premières semaines. Après le premier bâtiment, l'équipe du parc peut poser elle-même les capteurs.

## Ce qu'il faut vérifier avant une installation

Quatre questions règlent la plupart des installations à l'avance.

1. **Où les colonnes montantes sont-elles accessibles ?** Une porte de gaine, un plafond de sous-sol, un local technique. Le capteur a besoin d'une section de tuyau droite d'environ une largeur de main.
2. **En quoi est le tuyau ?** L'acier, le cuivre et le plastique fonctionnent tous. Le matériau est saisi au paramétrage du capteur, pour que la mesure soit calibrée sur la paroi qu'elle traverse.
3. **Existe-t-il un plan ?** Le plan de plomberie place les capteurs et sert à construire le jumeau. Sans plan, un seul passage le long des colonnes montantes fait le même travail.
4. **Où sont l'alimentation électrique et le signal ?** Les capteurs envoient une mesure toutes les 10 minutes. L'installateur vérifie la connectivité dans la gaine avant de poser le collier.

Aucune de ces vérifications ne demande un plombier, et aucune ne demande de couper l'eau.

Si vous gérez un parc et voulez voir cela sur vos propres colonnes montantes, commencez par la [page Immobilier](/fr/immobilier/) ou [réservez un appel de 30 minutes](/fr/reserver-un-appel/?for=real-estate).
