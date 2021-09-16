#!/usr/bin/env bash
# @author CJ lim@chernjie.com

COLOR_RED()   { echo -en "\033[31m"; }
COLOR_GREEN() { echo -en "\033[32m"; }
COLOR_YELLOW(){ echo -en "\033[33m"; }
COLOR_BLUE()  { echo -en "\033[34m"; }
COLOR_MAGENTA()  { echo -en "\033[35m"; }
COLOR_RESET() { echo -en "\033[0m";  }

_error() {
  _log COLOR_RED "$@"
  exit 1
}

_warning() {
  _log COLOR_YELLOW "$@"
}

_info() {
  _log COLOR_YELLOW "$@"
}

_success() {
  _log COLOR_GREEN "$@"
}

_log() {
  "$1" >&2
  shift
  echo "$@" >&2
  COLOR_RESET >&2
}

use() {
  for i do
    if ! command -v $i > /dev/null
    then
      _error command $i not found
    fi
  done
}

_encapsulateInCodeBlock() {
    sed -e '1i```\' | sed -e '$a```\'
}
