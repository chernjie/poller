#!/usr/bin/env bash

test 17 = $(date +%M) || exit 1

curl --silent -A Chrome https://www.uob.com.sg/data-api-rates/data-api/gold-silver/ |
	jq '{ currentDate, time, types : (.types | map(select(.description=="GSA"))) }' |
	sponge ./watch/gold-silver.json
