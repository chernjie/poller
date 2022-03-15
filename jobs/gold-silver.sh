#!/usr/bin/env bash

curl --silent -A Chrome https://www.uob.com.sg/data-api-rates/data-api/gold-silver/ | jq . | sponge ./watch/gold-silver.json
