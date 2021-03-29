#!/usr/bin/env bash

curl --silent http://publichealth.lacounty.gov/acd/ncorona2019/js/pod-data.js --output ./watch/pod-data.js
dos2unix ./watch/pod-data.js
sed "s,^var.*,[{," ./watch/pod-data.js | json2csv --output ./data/pod-data.csv
