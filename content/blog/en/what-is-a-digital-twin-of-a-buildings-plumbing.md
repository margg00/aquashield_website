---
id: digital-twin
slug: what-is-a-digital-twin-of-a-buildings-plumbing
title: What is a digital twin of a building's plumbing?
description: A model of the risers, branches and sensors that turns a flow deviation into a place to check first. What it contains, how it is built, and what it is for.
date: 2026-11-06
updated: 2026-11-06
author: Marguerite Benoist
authorId: marguerite-benoist
segment: product
segmentLabel: Product
answer: A digital twin of a building's plumbing is a model of the risers, branches and measuring points, and of which sensor sees which water. AquaShield builds it from the sensor positions and the plumbing plan. Its job is to turn a deviation at a sensor into the riser and the floors to check first.
statValue: 23 sensors on 10 risers
statLabel: at one new seven-storey residential building live with AquaShield in California.
statSource: AquaShield sites
statDate: 2026
definition: A digital twin is a software model of a physical system that is kept in step with it. For plumbing, the model holds the network topology (which pipe feeds which) and the live readings from the sensors on it.
faq1q: Do you need the original plumbing drawings?
faq1a: They help, and most buildings have them. Where drawings are missing, the twin is built from the sensor positions and a single walk through the risers.
faq2q: How precise is the localisation?
faq2a: To the riser or the building section. The twin tells the team which riser and which floors to check first, so the search starts in the right place.
faq3q: Does the twin change when the building changes?
faq3a: Yes. A renovation, a new branch or a moved sensor is updated in the twin, and the model relearns normal for the affected measuring points.
---
## Why a model of the pipes

A sensor sees the water that passes it. A riser sensor on floor 0 sees the water for every floor above. A branch sensor sees one floor. When the riser sensor reports more flow than normal and the branch sensor on floor 3 does not, the extra water is going somewhere else on the riser. That reasoning needs a map of who sees what. The digital twin is that map.

## What the twin contains

Three things.

1. **Topology.** Risers, branches, supply lines, and which feeds which. This comes from the plumbing plan and from the sensor positions.
2. **Measuring points.** Where each flow and pressure sensor sits on the topology, and so which water it sees.
3. **State.** The live readings and the learned normal for every measuring point, updated every 10 minutes.

The twin is not a 3D rendering, though it can be drawn as one. It is a graph with numbers on it.

## How AquaShield builds it

The twin is built from two inputs: the plumbing plan and the sensor positions. A portfolio sends the plan, or walks us through the risers once, and AquaShield places the sensors where they see the most. From there the twin is generated and the models start learning normal. At a new seven-storey residential building in California, 23 sensors on 10 risers were enough to cover the building.

## What it is for

The twin answers the question that follows every alert: where do we look first? A deviation on a riser with no matching deviation on any branch points at the riser itself. A deviation on one branch points at that floor. The alert names the riser and the floors to check, and the maintenance team goes there instead of opening the wall under the first stain.

It also answers a question that comes up in planning: where would one more sensor help most? Because the twin knows which water each sensor sees, it can show which part of the network is still only seen from far away.

## Where this goes next

## Twin, dashboard, model: who does what

Three words come up together and are easy to mix.

- The **model** is per measuring point. It learns normal flow and flags deviations. It knows nothing about the building's shape.
- The **twin** is per building. It knows the shape: which riser feeds which floors, which sensor sees which water. It takes the model's deviations and places them.
- The **dashboard** is what the team sees: every measuring point against its baseline, the alert list ranked by severity, and for each alert the riser and floors from the twin.

The model finds, the twin places, the dashboard tells. A portfolio with 22 buildings has 22 twins, 32 models and one dashboard.

The same twin that models a residential riser models a cooling loop in a data centre: supply, return, branches per rack, sensors per branch. The topology is different, the method is the same. See [how AquaShield works](/product/) or [book a 30-minute call](/book-a-call/).
