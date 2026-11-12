---
id: flow-baseline
slug: what-is-a-flow-baseline
title: What is a flow baseline, and how does AI learn it for a building?
description: Every riser has a rhythm. A model per measuring point learns it in 10-minute steps, and a leak is what that rhythm does not explain. How the learning works and why it is specific to hydraulic systems.
date: 2026-08-13
updated: 2026-08-13
author: Marguerite Benoist
authorId: marguerite-benoist
segment: product
segmentLabel: Product
coverAlt: A luminous band of normal daily water flow with a live reading line riding inside it, ending in one bright point.
answer: A flow baseline is the pattern of water flow a measuring point shows when everything is working: low at night, a peak in the morning, a weekly rhythm. AquaShield learns it per measuring point from readings every 10 minutes. A deviation is flow that the baseline does not explain, which is what a leak looks like in the data.
statValue: 144
statLabel: readings per measuring point per day, one every 10 minutes, at every AquaShield site.
statSource: AquaShield
statDate: 2026
definition: A baseline is not a single number. It is the expected flow for every time of day and day of week, with the normal spread around it. Flow inside that spread is normal. Flow outside it, for long enough, is a deviation.
faq1q: Why one model per measuring point?
faq1a: Because every riser has its own rhythm. A riser serving family flats peaks at different times from one serving offices. One model for the whole building would blur them together and miss the small, slow deviations that matter.
faq2q: What makes it specific to hydraulic systems?
faq2a: Water in pipes follows physical rules: flow and topology are linked, and the water entering a riser has to leave through its branches. The model and the digital twin use those links, which a generic anomaly detector does not know about.
faq3q: Does the model keep learning?
faq3a: Yes. Normal shifts with seasons and occupancy, and the model follows it. Feedback from the maintenance team on each alert goes back into the model.
---
## Every riser has a rhythm

Stand next to a residential riser at 3 a.m. and the water is nearly still. At 7 a.m. it is moving hard. On a Sunday the morning peak comes later. Across a year, summer and winter differ. That rhythm is the baseline, and it is the thing a model has to know before it can say that something is wrong.

## How it is learned

Every measuring point reports a reading every 10 minutes, 144 a day. From those readings, a model per measuring point builds the expected flow for each time of day and day of week, together with the normal spread around it. This takes the first weeks after installation. During that time the system learns and does not alert, because an alert before normal is known would be a guess.

The model is specific to its measuring point. A riser serving family flats and a riser serving offices in the same building have different baselines, and a single model for the building would blur them. The slow, small deviations that matter most, a night baseline that no longer returns to its usual level, are only visible against the right rhythm.

## What a deviation is

A deviation is flow that the baseline does not explain, for long enough to matter. Not a single high reading, because showers happen. A pattern: night flow that stays elevated, a branch that runs when its neighbours are still, a riser whose flow no longer adds up to the flow of its branches. The model ranks deviations by severity, and the digital twin places them on the riser and the floors to check first.

## Why hydraulic systems need their own machine learning

Generic anomaly detection treats every signal as a series of numbers. Water in pipes is not just numbers. Flow is physically linked across the network, and the topology says which sensors must agree with each other. AquaShield's models use those links: a deviation on a riser is checked against the branches it feeds, and a change on a branch is checked against the riser flow that should explain it. That is what lets the system tell a leak from a long shower.

## Learning from the team

Every alert is reviewed with the maintenance team, and the outcome goes back into the model. Over months, each measuring point's model gets sharper on exactly the deviations that matter in that building.

## What the baseline is not

Two things are often mistaken for a baseline.

- **A threshold.** A rule like "alert above 500 litres an hour" ignores the time of day. At 7 a.m. that is normal, at 3 a.m. it is a leak. A baseline is a threshold that moves with the rhythm.
- **An average.** The average flow of a riser is a single number that it almost never shows. The baseline holds the expected flow for every slot of the week, with the spread around it, so a quiet Sunday morning is not mistaken for a stuck valve.

Getting this right is why the first weeks are spent learning rather than alerting. A system that alerts from day one is using a threshold, whatever it calls it.

See [how AquaShield works](/product/), or [book a 30-minute call](/book-a-call/).
