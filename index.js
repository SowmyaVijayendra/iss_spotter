// index.js
const { error } = require("console");
const { nextISSTimesForMyLocation } = require("./iss");

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  console.log(passTimes);
});

/*
fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned IP:' , ip);
});
*/
/*
fetchCoordsByIP('72.140.123.120', (error, data) =>{
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned Co-ordinates:' , data);
});
*/
/*
const exampleCoords = { latitude: '43.653226', longitude: '-79.3831843' };
fetchISSFlyOverTimes( exampleCoords, (error, data) =>{
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned ISS fly over times:' , data);
});
*/
