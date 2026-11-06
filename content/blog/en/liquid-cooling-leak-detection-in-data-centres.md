---
id: liquid-cooling
slug: liquid-cooling-leak-detection-in-data-centres
title: How do you detect a leak in a liquid-cooled data centre before the outage?
description: Floor leak cables fire after the water is on the floor. Flow and pressure sensing per rack sees the deviation in the loop itself. How the same model that watches risers watches a cooling loop.
date: 2026-10-29
updated: 2026-10-29
author: Paul Beckers
authorId: paul-beckers
segment: data-centers
segmentLabel: Data centres
answer: By watching the cooling loop itself instead of the floor under it. Clamp-on flow and pressure sensors on the branch to each rack learn the loop's normal and flag a drop in pressure or a flow that no longer matches its neighbours, before enough liquid has escaped to reach a leak cable.
statValue: 10 minutes
statLabel: between readings at every AquaShield measuring point, the same cadence on a riser and on a cooling loop.
statSource: AquaShield
statDate: 2026
definition: A leak cable is a sensing rope laid on the floor that closes a circuit when liquid touches it. It detects liquid that has already left the loop and reached the floor.
faq1q: Do the sensors touch the coolant?
faq1a: No. They clamp onto the outside of the loop's pipes and read through the wall. Nothing is cut into the cooling loop.
faq2q: Does it work with the loop's own monitoring?
faq2a: Yes. The loop's controller watches temperatures and pump state. AquaShield watches flow and pressure per branch and learns what normal looks like for each one, which is a different signal.
faq3q: Where is this running?
faq3a: The sensors and the model watch residential risers today, in Germany and the US. First data-centre sites in Switzerland.
---
## The problem with the floor

Liquid cooling moves water or coolant through a loop to every rack. The standard way to catch a leak is a cable on the floor that reacts to moisture. It works, in the sense that it fires. But it fires after the liquid has left the loop, run down the rack and reached the floor. By then a rack has lost cooling and an outage clock is running.

For a facility lead, water is not the pain. The outage is.

## Watching the loop instead

The same physics that finds a weeping joint on a residential riser finds a weeping joint on a cooling branch. Clamp-on ultrasonic sensors read the flow through the pipe wall. Pressure sensors read the state of the loop. Both report every 10 minutes. Nothing is cut into the loop and nothing touches the coolant.

A model per measuring point learns the loop's normal: what flow looks like on each branch at each load, how pressure sits across the supply and return. A deviation is a pattern that normal does not explain: a branch whose flow no longer matches its neighbours under the same load, a pressure that drifts down with no change in pumping.

## Per rack, not per room

A leak cable tells you that the room has a leak. Per-branch sensing tells you which rack. The digital twin that models a building's risers models a cooling loop in the same way: supply, return, branches, which sensor sees which coolant. When branch 3 deviates and the others do not, the alert names rack 3.

## From residential risers to liquid cooling

The sensors and the model are the ones that watch residential risers today, at a portfolio of 22 buildings in Germany and at sites in California. The topology is different in a data centre, the method is the same. First sites in Switzerland.

## What a first site looks like

A first site is small on purpose.

1. **One loop, one rack row.** Enough branches to show per-rack localisation, small enough to install in a day.
2. **Clamp on.** Flow sensors on each branch, pressure sensors on supply and return. No cutting, no coolant contact, no change to the loop's own controller.
3. **Learn.** The models learn the loop's normal under the loads the row actually sees, which takes the first weeks.
4. **Detect.** The facility team sees the first alerts on its own racks, with the branch named, and decides from there.

The question a first site answers is not whether the physics works. It does on residential risers today. The question is what the alerts are worth to this facility, and that is answered on its own racks.

The way in is one cooling loop and one rack row. The sensors clamp on, the twin maps the loop, the model learns its normal, and the facility team sees the first alerts on its own racks. See the [data centres page](/data-centers/), or [book a 30-minute call](/book-a-call/?for=data-centers).
