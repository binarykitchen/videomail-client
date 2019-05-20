#!/bin/bash
set -e
set -o pipefail

export GIT_MERGE_AUTOEDIT=no

die() {
    unset GIT_MERGE_AUTOEDIT
    echo >&2 "☠ ☠ ☠ ☠ ☠ ☠ ☠  $@  ☠ ☠ ☠ ☠ ☠ ☠ ☠"
    exit 1
}

GREEN='\033[0;32m'
NC='\033[0m' # No Color

printf "${GREEN}Checking for vulnerabilities...\n${NC}"
# thanks to set -e it will exit here if audit fails
yarn run audit-ci --config audit-ci.json

# todo: figure out an elegant solution to avoid duplicate code
# when having three bash scripts for patches, features and releases
# maybe with command line args?
# when done, rename this file

for i in "$@"
do
case $i in
    -i=*|--importance=*)
    IMPORTANCE="${i#*=}"
    shift # past argument=value
    ;;
    *)
    # unknown option
    ;;
esac
done

if [[ -z "$IMPORTANCE" ]]; then
    die "Aborting the bump! Argument --importance is missing."
fi

# ensures all is commited
if [[ `git status --porcelain` ]]; then
    die "Aborting the bump! You have uncommitted changes."
fi

# Ensures master is up to date
git checkout master
git pull
git checkout develop

read VERSION <<< $(gulp bumpVersion --importance=$IMPORTANCE | awk '/to/ {print $5}')

git checkout master
git push
git checkout develop
git push

# Start a new release
git flow release start $VERSION

# This will increment version in package.json
gulp bumpVersion --write --version=$VERSION

# Ensure dependencies are okay
yarn

# Rebuild all assets
gulp build --minify

git add -A
git commit -am "Final commit of version $VERSION" --no-edit

printf "${GREEN}Logging to npm ...\n${NC}"
yarn login

printf "${GREEN}Publishing to npm ...\n${NC}"
yarn publish --new-version $VERSION

# Complete the previous release
git flow release finish $VERSION -m "Completing release of $VERSION" # This will also tag it

git push

git checkout master
git push --follow-tags

# Prepare the develop branch for the new cycle
git checkout develop

unset GIT_MERGE_AUTOEDIT

printf "${GREEN}All good. Ready for the next cycle!${NC}"
