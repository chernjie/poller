#!/usr/bin/env bash

curl --silent https://appointments.lacounty.gov/vaccinestaffing/LocationsMap --output ./watch/LocationsMap.html
html-beautify --replace ./watch/LocationsMap.html
dos2unix ./watch/LocationsMap.html
gsed -i /_Incapsula_Resource/d ./watch/LocationsMap.html
