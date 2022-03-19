#!/usr/bin/env bash

test "03" = "$(date +%M)" || exit 1

curl --silent -A Chrome https://www.uob.com.sg/data-api-rates/data-api/gold-silver/ \
    --output ./data/gold-silver.json

wc -c ./data/gold-silver.json | while read byte file
do test 0 -eq $byte && exit 1
done

cat ./data/gold-silver.json |
	jq '{ currentDate, time, types : (.types | map(select(.description=="GSA"))) }' |
	npx js-yaml |
	sponge ./watch/gold-silver.yaml
