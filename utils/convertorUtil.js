//https://gis.stackexchange.com/questions/2951/algorithm-for-offsetting-a-latitude-longitude-by-some-amount-of-meters
//https://en.wikipedia.org/wiki/Earth_radius

function cartesianToLongLatWithOffset({
  x,
  y,
  offsetLongitude,
  offsetLatitude
}) {
  const lat = offsetLatitude;
  const lon = offsetLongitude;
  const R = 6378137; //TODO is this the correct radius for zero altitude/z values? (See refs above)
  const dn = x;
  const de = y;
  const dLat = dn / R;
  const dLon = de / (R * Math.cos((Math.PI * lat) / 180));
  const lat0 = lat + dLat * (180 / Math.PI);
  const lon0 = lon + dLon * (180 / Math.PI);
  return { longitude: lon0, latitude: lat0 };
}

module.exports.cartesianToLongLatWithOffset = cartesianToLongLatWithOffset;
