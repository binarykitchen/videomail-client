#!/bin/bash
set -e


DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SSL_DIR="$DIR/../etc/ssl-certs"

# Set the wildcarded domain we want to use
DOMAIN="local.videomail-client.io"

# A blank passphrase
PASSPHRASE=""

# Set our CSR variables
SUBJ="
C=NZ
ST=Sandringham
O=
localityName=Auckland
commonName=$DOMAIN
organizationalUnitName=
emailAddress=michael@videomail.io
"

# Generate our Private Key, CSR and Certificate
openssl genrsa -out "$SSL_DIR/fake.key" 2048
openssl req -new -subj "$(echo -n "$SUBJ" | tr "\n" "/")" -key "$SSL_DIR/fake.key" -out "$SSL_DIR/fake.csr" -passin pass:$PASSPHRASE
openssl x509 -req -days 365 -in "$SSL_DIR/fake.csr" -signkey "$SSL_DIR/fake.key" -out "$SSL_DIR/fake.crt"

# Not needed anymore
rm -rf "$SSL_DIR/fake.csr"
