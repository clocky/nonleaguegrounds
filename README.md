# nonleaguegrounds.com

[![Node.js CI](https://github.com/clocky/nonleaguegrounds/actions/workflows/build.yaml/badge.svg)](https://github.com/clocky/nonleaguegrounds/actions/workflows/build.yaml)

Site generated with Eleventy that transforms schema.org data into a bulma.io
powered site, containing information about the non-league football pyramid in
the United Kingdom.

## Tools

* Built with [Eleventy](https://www.11ty.dev) (2.0.0-canary.18)
* Icons from [Fontawesome](http://fontawesome.com) (5.0.0)
* CSS framework: [Bulma](https://bulma.io) (0.9.4)
  * Bulma interactivity via [BulmaJS](https://bulmajs.tomerbe.co.uk)
* Some crests and information via [API Football](http://api-football.com)
* Mapping
  * Aerial images via [Bing Maps API](https://www.microsoft.com/en-us/maps/choose-your-bing-maps-api)
  * Static maps via [Google Maps Platform](https://developers.google.com/maps/documentation/maps-static/overview)
* Photography
  * Creative Commons licensed images via [Flickr](https://flickr.com)

### Data sources

* [gov.uk](https://find-and-update.company-information.service.gov.uk)
* [postcodes.io](https://api.postcodes.io)

### To-do

* Implement nearest railway station using [David Wheatley's dataset](https://github.com/davwheat/uk-railway-stations)
