---
id: non-invasive
slug: how-does-non-invasive-leak-detection-work
title: How does non-invasive leak detection work in a building?
description: Clamp-on ultrasonic sensors read flow through the pipe wall, a model learns what normal looks like, and a digital twin places the deviation. No pipe cutting.
date: 2026-07-02
updated: 2026-07-02
author: Marguerite Benoist
authorId: marguerite-benoist
segment: product
segmentLabel: Product
answer: Non-invasive leak detection reads the water from outside the pipe. An ultrasonic sensor clamps onto the riser and measures flow through the pipe wall, a pressure sensor sits on an existing tap, and a model per measuring point learns the building's normal flow. A leak shows up as a pattern that normal does not explain.
statValue: Under 15 min
statLabel: per sensor, clamp-on, no pipe cutting, the water stays on at the AquaShield sites live today.
statSource: AquaShield installs
statDate: 2026
definition: Non-invasive means nothing enters the pipe. The sensor is strapped to the outside, sends an ultrasonic signal through the wall and the water, and derives the flow from how the water changes the signal. The pipe is never opened.
faq1q: Does the sensor touch the water?
faq1a: No. It clamps onto the outside of the pipe and reads through the wall. There is no contact with the water and no change to the plumbing.
faq2q: Does it work on insulated pipes?
faq2a: Yes. A short section of insulation is opened at the sensor position and closed again around it. The rest stays as it is.
faq3q: What if the pipe is old?
faq3a: The sensors clamp onto any accessible pipe, old or new. The digital twin is built from the sensor positions and the plumbing plan, so the age of the building does not matter.
---
## Reading water through the pipe wall

The oldest way to measure flow is to cut the pipe and put a meter in it. That means a plumber, a shutdown, and a joint that can itself leak one day. Ultrasonic flow sensing avoids all of that. Two transducers sit on the outside of the pipe at a slight angle to each other. One sends a pulse through the pipe wall and the water, the other receives it. Water moving with the pulse speeds it up, water moving against it slows it down. The difference in travel time is the flow.

The sensor is strapped to the pipe with a bracket. Installation takes under 15 minutes. The water stays on the whole time, and the tenants never notice.

## Two kinds of sensor

AquaShield uses two measurements that complement each other.

- **Flow**, from clamp-on ultrasonic sensors on risers and supply lines. Flow tells you how much water is moving and when.
- **Pressure**, from sensors on existing taps. Pressure tells you about the state of the network as a whole, and it reacts to changes that a single flow sensor may not see.

Both report a reading every 10 minutes. With 32 measuring points at one portfolio, that is 4,608 readings a day from a single customer.

## The model learns normal first

A reading on its own means little. Flow at 3 a.m. in a residential riser is low, flow at 7 a.m. is high, and a Sunday looks different from a Tuesday. So each measuring point gets its own model, and the first thing the model does is learn what normal looks like for that riser: the night baseline, the morning peak, the weekday and weekend rhythm.

Only then does detection start. A deviation is a flow pattern that the learned normal does not explain, for example a night baseline that no longer returns to its usual level. That pattern is what a hidden leak looks like from outside the pipe.

## The digital twin places it

Knowing that something is wrong is half the job. The other half is knowing where. AquaShield builds a digital twin of the building's plumbing from the sensor positions and the plumbing plan: which riser feeds which floors, which sensor sees which water. When a deviation appears, the twin narrows it to the riser and the floors to check first. The maintenance team gets a place to go, not a stain to work backwards from.

## What this means for a portfolio

Non-invasive sensing changes the economics of monitoring. No pipe cutting means no plumber per sensor and no shutdown per building. A day of installs covers a building, the twin is built the same day, and the model learns normal over the first weeks. After the first building, a portfolio's own team can clamp on the sensors.

## What to check before an install

Four questions settle most installs in advance.

1. **Where are the risers accessible?** A shaft door, a basement ceiling, a plant room. The sensor needs a straight section of pipe about a hand's width long.
2. **What is the pipe made of?** Steel, copper and plastic all work. The material is entered when the sensor is set up, so the reading is calibrated to the wall it reads through.
3. **Is there a plan?** The plumbing plan places the sensors and builds the twin. Where a plan is missing, one walk through the risers does the same job.
4. **Where is power and signal?** The sensors report every 10 minutes. The installer confirms connectivity in the shaft before the bracket goes on.

None of these needs a plumber, and none of them needs the water off.

If you manage a portfolio and want to see this on your own risers, start on the [real estate page](/real-estate/) or [book a 30-minute call](/book-a-call/?for=real-estate).
