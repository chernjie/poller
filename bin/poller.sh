#!/usr/bin/env bash
# @author CJ lim@chernjie.com

cd "$(dirname "${BASH_SOURCE}")/.."
source ./.env
source ./bin/utils.sh

use git slack.sh curl gsed json2csv dos2unix html-beautify

mkdir -p ./watch ./data

_runJob() {

    test -x "$@" || return $?
    "$@" || return $?

    git add ./watch
    git commit -m "$@"
    test $? -eq 0 || return $?

    git log -1 --patch --ignore-all-space --unified=0 --format="%h %B" -- ./watch |
        _encapsulateInCodeBlock |
        xargs -0 slack.sh
}

for i in ./jobs/*.sh ./jobs/*.js
do _runJob "$i"
done

git rev-list --after="$(($(date +%s) - 60))" HEAD | grep -q . && git push
