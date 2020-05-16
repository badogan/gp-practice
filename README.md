# Tolga PoC

## Current State
/{{URL}}api/v1/existence/newexistence
A new existence object can be added to a collection.
Location property is GeoJSON (currently, Point)

{{URL}}api/v1/existence/q1results
Summary. Identify and filter target documents for a given MAC address and starting date.
Description. (1) Uses MongoDB aggregation thru NodeJS controller code and Mongoose Driver
@param  {string}    eMAC    MAC Address 
@param  {timestamp, ISO}    eTimestamp  Starting Date (ISO - so can go to a second if needed)
@return {array of documents}

{{URL}}api/v1/existence/q2results
Summary. Identify and filter target documents that fall within a proximity (maxDistance) and a date range
Description. (1)
@param  {number}    longitude    longitude
@param  {number}    latitude    latitude
@param  {number}    maxDistance    maximum proximity in meters
@param  {timestamp, ISO}    startDate  Starting Date (ISO) for the targeted date range
@param  {timestamp, ISO}    endDate  End Date (ISO) for the targeted date range
@return {array of documents}

TODO: (Dev) Put q1 and q2 queries together and return the list of MACs the "target MAC" had contacted with
TODO: (Dev) Prepare a basic entry form and put FE infra in place (React, Redux, ReactRouter, Page + Component structure with initial API wiring)
TODO: (Research) what is used for queue/task management in the market (especially the ones I am interested with (@TOLGA What do you use?))
TODO: (Think) Move to TS on backend code? Write tests and deploy as well?

## Brainstorming - Potential Next Tasks
- MapReduce (needed?), Sharding: How would those need to be considered? 
- Queue Management needed once the use case is clarified with its integration points and expected user communication during the search
- User Journey - Personas, use cases would help on expectation management and (might) help in some backend app + infra ["How will the user know what is going on? Needed?]
- MongoDB integration on how currently the data enters the system and travels. At which step a new doc created? Would an ongoing data cleanup + summary needed? 
- GeoJSON Object alternatives need to be studied (along with above). Should a "signature object involving start-end dates and polygons" be considered? Or something similar?
- Performance, PoC, Experimentation needed in all stages 

## Organizational Aspects
- Effort, dev and experimentation cannot be done in isolation from the current infra and team. Must be an extension
- Cost, onprem, cloud, admin, sign/login, balance in between use of current and redesign/develop and learnings will need to be ongoing