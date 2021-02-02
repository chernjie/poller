#!/usr/bin/env node

const fs = require('fs')
const moment = require('moment')
const fetch = require('node-fetch')

async function vcr(filecache, fn, ...args) {

  if (fs.existsSync(filecache)) {
    return require(`.${filecache}`)
  }

  fs.writeFile(
    filecache,
    JSON.stringify(await fn(args), null, 2),
    err => console.error(err),
  )
}

function _locationSearch(location, name) {

  const payload = {
    location,
    fromDate: moment().format('YYYY-MM-DD'),
    vaccineData: "WyJhM3F0MDAwMDAwMDFBZExBQVUiLCJhM3F0MDAwMDAwMDFBZE1BQVUiLCJhM3F0MDAwMDAwMDFBZ1VBQVUiLCJhM3F0MDAwMDAwMDFBZ1ZBQVUiXQ==",
    url: "https://myturn.ca.gov/location-select",
  }

  return fetch("https://api.myturn.ca.gov/public/locations/search", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json;charset=UTF-8",
      "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
    },
    "referrer": "https://myturn.ca.gov/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": JSON.stringify(payload),
    "method": "POST",
    "mode": "cors"
  })
  .then(res => res.json())
  .then(json => ({
    ...json,
    locations: json.locations.map(l => ({
      displayAddress: l.displayAddress,
      extId: l.extId,
      location: l.location,
      name: l.name,
      vaccineData: l.vaccineData,
    }))
  }))
}

async function _allLocationSearch() {

  const locSearch = [
    { lat: 33.9581184, lng: -118.3424554, }, // inglewood
    { lat: 34.2370749, lng: -118.5278021, }, // northridge
    { lat: 34.4213988, lng: -118.5897279, }, // sixflags
    { lat: 33.9810337, lng: -117.8897468, }, // rowlandheights
  ]

  const results = Object.values(
    (await Promise.all(locSearch.map(_locationSearch)))
    .map(el => el.locations)
    .reduce((last, el) => last.concat(el), [])
    .reduce((last, el) => {
      last[el.extId] = el
      return last
    }, {})
  )

  return Array.from(results)
}

async function _getAvailability({ extId, vaccineData }) {
  const payload = {
    "startDate": moment().format('YYYY-MM-DD'),
    "endDate": moment().endOf('month').format('YYYY-MM-DD'),
    vaccineData,
    "doseNumber": 1,
    "url": "https://myturn.ca.gov/appointment-select"
  }

  return fetch(`https://api.myturn.ca.gov/public/locations/${extId}/availability`, {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json;charset=UTF-8",
      "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site"
    },
    "referrer": "https://myturn.ca.gov/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": JSON.stringify(payload),
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  })
  .then(res => res.json())
  .then(data => {
    return {
      ...data,
      availability: data.availability.filter(a => a.available),
    }
  })
}

async function _getAllAvailability() {

  return await Promise.all(
    (await vcr('./watch/myturn-search.json', _allLocationSearch))
    .filter(el => el.vaccineData == 'WyJhM3F0MDAwMDAwMDFBZExBQVUiXQ==')
    .map(_getAvailability)
  )
}

async function main([ ]) {

  const availability = await _getAllAvailability()
  fs.writeFile(
    './watch/myturn-availability.json',
    JSON.stringify(availability, null, 2),
    err => console.error(err),
  )

}

main(process.argv.slice(2))
