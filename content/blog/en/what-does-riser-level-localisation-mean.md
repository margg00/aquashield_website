---
id: riser-level
slug: what-does-riser-level-localisation-mean
title: What does riser-level leak localisation mean?
description: Detection says that something is wrong. Localisation says where. How AquaShield narrows a deviation to the riser and the floors to check first.
date: 2026-10-08
updated: 2026-10-08
author: Marguerite Benoist
authorId: marguerite-benoist
segment: product
segmentLabel: Product
answer: Riser-level localisation means the alert names the riser, and the floors on it, where the deviation sits. Detection says that water is going where it should not. Localisation says which vertical pipe and which part of the building, so the search starts there instead of behind the first wet wall.
statValue: 32 measuring points
statLabel: across 22 buildings at the first AquaShield portfolio, live since March 2026.
statSource: AquaShield sites
statDate: 2026
definition: A riser is the vertical pipe that carries water up through a building and feeds the branches on each floor. Most buildings have several. Riser-level means the alert identifies which one.
faq1q: Why not localise to the exact pipe segment?
faq1a: The sensors sit on the risers and supply lines, not on every segment. The twin reasons from what they see, which is enough to name the riser and the floors. From there the team finds the segment on site.
faq2q: Does more sensors mean better localisation?
faq2a: Yes. Every added measuring point splits the network further, so a deviation can be placed in a smaller section. The twin shows where one more sensor would help most.
faq3q: What does the maintenance team receive?
faq3a: The building, the riser, how far the flow is from normal and for how long, and what to check first.
---
## Detection is not localisation

Many systems can tell you that a building is using more water than it should. That is detection, and on its own it starts a search of the whole building. Localisation is the part that makes the alert useful: it tells the team where to go.

## How the twin reasons

AquaShield's digital twin knows which sensor sees which water. A sensor at the bottom of a riser sees everything above it. A branch sensor on floor 3 sees that floor only. When the riser shows a deviation and the branch on floor 3 does not, the extra water is on the riser itself or on a floor without its own sensor. When the branch on floor 3 shows it too, the deviation is on or after that branch.

That reasoning runs for every measuring point, every 10 minutes. The result is a riser and a range of floors, ranked by how well each explains the data.

## What the alert says

A sample from the sites where AquaShield is live, anonymised: Building 14, riser B. Flow 38 percent above the night baseline for six hours. Check first: riser B, floors 3 to 5, shut-off valve on floor 3. Reviewed with the maintenance team.

Every element has a job. The building and riser say where. The percentage and duration say how serious. The check-first line says what to do in the first ten minutes on site.

## Why riser-level is the right level

A riser serves a column of flats. Narrowing a leak to a riser and three floors turns a building-wide search into a visit to one shaft. The team opens the right access panel instead of the wrong wall. The repair itself is the same as it ever was, a plumber and a part. What changes is how long it takes to get the plumber to the right spot.

## Where precision comes from

Two things sharpen localisation over time. More measuring points split the network into smaller sections. And every incident the model learns from refines what a deviation on that riser looks like. The twin shows where one more sensor would help most, so a portfolio can add precision where it matters.

## What changes on the day of an alert

Without localisation, an alert that says "the building is using too much water" starts a process the maintenance team knows well: walk the basement, check the obvious joints, wait for a stain. With riser-level localisation, the first hour looks different.

1. The alert names riser B and floors 3 to 5. The team opens the shaft access on floor 3, not the ceiling under the first stain.
2. The check-first line names the shut-off valve on floor 3. If the joint is found, the riser section is isolated in minutes and the flats above are on reduced service for an afternoon instead of a week.
3. The outcome goes back into the system. If the source was on floor 4, the model learns what a floor-4 deviation looks like on that riser.

The repair is the same as it ever was. The search is what shrinks.

See [how AquaShield works](/product/), or [book a 30-minute call](/book-a-call/).
