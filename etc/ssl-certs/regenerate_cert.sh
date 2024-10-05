#!/bin/bash

set -ex

# That's for local development only

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

DOMAIN="localhost"
KEY_FILE="$DIR/localhost.key"
CERT_FILE="$DIR/localhost.crt"

mkcert -cert-file $CERT_FILE -key-file $KEY_FILE $DOMAIN

echo "Done!"
