#!/bin/bash

# inspired by
# https://github.com/coolaj86/nodejs-self-signed-certificate-example/blob/master/make-root-ca-and-certificates.sh

# To get rid of the warnings, simply add the root certificate in the client folder
# to your list of certificates in the browser and adjust their options to "trusted"

FQDN="local.videomail-client.io"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SSL_DIR="$DIR/ssl-certs"

# make directories to work from
mkdir -p $SSL_DIR/{server,client,ca,tmp}

# Create your very own Root Certificate Authority
openssl genrsa \
  -out $SSL_DIR/ca/my-root-ca.key.pem \
  2048

# Self-sign your Root Certificate Authority
# Since this is private, the details can be as bogus as you like
openssl req \
  -x509 \
  -new \
  -nodes \
  -key $SSL_DIR/ca/my-root-ca.key.pem \
  -days 1024 \
  -out $SSL_DIR/ca/my-root-ca.crt.pem \
  -subj "/C=NZ/ST=Sandringham/L=Blahblah/O=ACME Signing Authority Inc/CN=${FQDN}"

# Create a Device Certificate for each domain,
# such as example.com, *.example.com, awesome.example.com
# NOTE: You MUST match CN to the domain name or ip address you want to use
openssl genrsa \
  -out $SSL_DIR/server/my-server.key.pem \
  2048

# Create a request from your Device, which your Root CA will sign
openssl req -new \
  -key $SSL_DIR/server/my-server.key.pem \
  -out $SSL_DIR/tmp/my-server.csr.pem \
  -subj "/C=NZ/ST=Sandringham/L=Blahblah/O=ACME Tech Inc/CN=${FQDN}"

# Sign the request from Device with your Root CA
# -CAserial $SSL_DIR/ca/my-root-ca.srl
openssl x509 \
  -req -in $SSL_DIR/tmp/my-server.csr.pem \
  -CA $SSL_DIR/ca/my-root-ca.crt.pem \
  -CAkey $SSL_DIR/ca/my-root-ca.key.pem \
  -CAcreateserial \
  -out $SSL_DIR/server/my-server.crt.pem \
  -days 500

# Create a public key, for funzies
# see https://gist.github.com/coolaj86/f6f36efce2821dfb046d
openssl rsa \
  -in $SSL_DIR/server/my-server.key.pem \
  -pubout -out $SSL_DIR/client/my-server.pub

# Put things in their proper place
rsync -a $SSL_DIR/ca/my-root-ca.crt.pem $SSL_DIR/server/
rsync -a $SSL_DIR/ca/my-root-ca.crt.pem $SSL_DIR/client/

# Not needed anymore
rm -rf "$SSL_DIR/tmp"
