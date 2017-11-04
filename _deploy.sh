#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "$DIR"/functions && npm install

if [ "$1" == "build" ]; then
	 "$DIR"/react_app/_build.sh
fi

firebase deploy
