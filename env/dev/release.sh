#!/bin/bash
set -eo pipefail

GREEN='\033[0;32m'
NC='\033[0m' # No Color

info() {
    printf "${GREEN}$@${NC}"
}

export GIT_MERGE_AUTOEDIT=no

die() {
    unset GIT_MERGE_AUTOEDIT
    echo >&2 "☠  ☠  ☠  ☠  ☠  ☠  ☠  $@ ☠  ☠  ☠  ☠  ☠  ☠  ☠"
    exit 1
}

info "Checking for vulnerabilities...\n"

# thanks to set -e it will exit here if audit fails
npm run audit

# todo: figure out an elegant solution to avoid duplicate code
# when having three bash scripts for patches, features and releases
# maybe with command line args?
# when done, rename this file

for i in "$@"; do
    case $i in
    -i=* | --importance=*)
        IMPORTANCE="${i#*=}"
        shift # past argument=value
        ;;
    *)
        # unknown option
        ;;
    esac
done

if [[ -z ${IMPORTANCE:-} ]]; then
    die "Aborting the bump! Argument --importance is missing"
fi

# ensures all is commited
if [[ $(git status --porcelain) ]]; then
    die "Aborting the bump! You have uncommitted changes"
fi

# Ensures master is up to date
git checkout master
git pull
git checkout develop

info "Figuring next version for importance ${IMPORTANCE}...\n"
read VERSION <<<$(gulp bumpVersion --importance=$IMPORTANCE | awk '/to/ {print $5}')
printf "${GREEN}It's ${VERSION}${NC}\n"

git checkout master
git push
git checkout develop
git push

# Start a new release
git flow release start $VERSION

# This will increment version in package.json
gulp bumpVersion --write --version=$VERSION

# Ensure dependencies are okay
npm install

# Rebuild all assets
gulp build --minify

git add -A
git commit -m "Final commit of version $VERSION" --no-edit

# not needed anymore with the switch from yarn to npm
# info "Logging to npm ...\n"
# npm login

info "Publishing to npm ...\n"
npm publish

# Complete the previous release
git flow release finish $VERSION -m "Completing release of $VERSION" # This will also tag it

git push

git checkout master
git push --follow-tags

# Prepare the develop branch for the new cycle
git checkout develop

unset GIT_MERGE_AUTOEDIT

info "\nAll good. Ready for the next cycle!\n"
