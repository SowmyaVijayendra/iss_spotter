/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const { error } = require("console");
const request = require("request");
const fetchMyIP = function (callback) {
  // use request to fetch IP address from JSON API

  let apiUrl = `https://api.ipify.org?format=json`;
  request(apiUrl, (error, response, body) => {
    if (error) {
      callback(error, null);
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      let ip = JSON.parse(body).ip;
      if (!ip) callback("The IP address not found!", null);
      else callback(null, ip);
    }
  });
};

const fetchCoordsByIP = function (ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      // parse the returned body so we can check its information
      const parsedBody = JSON.parse(body);
      if (!JSON.parse(body).success) {
        const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
        callback(Error(message), null);
      } else {
        let latitude = parsedBody.latitude;
        let longitude = parsedBody.longitude;
        let data = { latitude: latitude, longitude: longitude };
        if (!data) callback("The Geo Co-ordinates not found!", null);
        else callback(null, data);
      }
    }
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function (coords, callback) {
  request(
    `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`,
    (error, response, body) => {
      if (error) {
        callback(error, null);
      }
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching ISS flyover times. Response: ${body}`;
        callback(Error(msg), null);
        return;
      } else {
        // parse the returned body so we can check its information
        const parsedBody = JSON.parse(body);
        let data = parsedBody.response;
        if (!data) callback("The ISS flyover times not found!", null);
        else callback(null, data);
      }
    }
  );
};
/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      callback(error, null);
      return;
    }
    fetchCoordsByIP(ip, (error, data) => {
      if (error) {
        callback(error, null);
        return;
      }
      fetchISSFlyOverTimes(data, (error, passes) => {
        if (error) {
          callback(error, null);
          return;
        }
        let passTimes = [];
        passes.forEach((element) => {
          passTimes.push(`Next pass at ${new Date(element.risetime)} for ${element.duration} seconds!`);
        });
        callback(null, passTimes);
      });
    });
  });
};
module.exports = { nextISSTimesForMyLocation };
