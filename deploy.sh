#!/usr/bin/env bash

set -eu;

URL="$(node_modules/.bin/now deploy -e STRIPE_PUBLIC_KEY=@dev-stripe-public-key -e STRIPE_SECRET_KEY=@dev-stripe-secret-key --team=sholladay --token=$ZEIT_TOKEN --public)";
node_modules/.bin/await-url "$URL" --tries=200;
node_modules/.bin/now alias set "$URL" dev.seth-holladay.com --team=sholladay --token=$ZEIT_TOKEN;
# Attempt to remove old deployment, see https://github.com/zeit/now-cli/issues/691
node_modules/.bin/now remove seth-holladay.com --yes --safe --team=sholladay --token=$ZEIT_TOKEN;
