#!/usr/bin/env bash
# @author CJ lim@chernjie.com

cd "$(dirname "${BASH_SOURCE}")/.."
source ./.env
source ./bin/utils.sh

use git slack.sh curl sed json2csv dos2unix html-beautify

mkdir -p ./watch ./data

for i in ./jobs/*.sh
do "$i"
done

wait
git add ./watch
git commit -m "$0 $@"
if test $? -eq 0
then git log -1 -p -w -U0 ./watch | xargs -0 slack.sh
fi
