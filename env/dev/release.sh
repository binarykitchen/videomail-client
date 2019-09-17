#!/bin/bash
set -eEuo pipefail

GREEN='\033[0;32m'
NC='\033[0m' # No Color
DRY=false # $ DRY_RUN=1 env/dev/release.sh

if [[ ! -z ${DRY_RUN+x} ]]; then
  DRY=true
fi

safe_run() {
    if $DRY; then
        echo dry: $@
    else
        echo executing: $@
        $@
    fi
}

info() {
    printf "${GREEN}$@${NC}"
}

safe_run export GIT_MERGE_AUTOEDIT=no

die() {
    unset GIT_MERGE_AUTOEDIT
    echo >&2 "☠  ☠  ☠  ☠  ☠  ☠  ☠  $@ ☠  ☠  ☠  ☠  ☠  ☠  ☠"
    exit 1
}

info "Checking for vulnerabilities...\n"

# thanks to set -e it will exit here if audit fails
safe_run yarn run audit

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

if [[ -z ${IMPORTANCE:-} ]]; then
    die "Aborting the bump! Argument --importance is missing"
fi

# ensures all is commited
if [[ `git status --porcelain` ]]; then
    die "Aborting the bump! You have uncommitted changes"
fi

# Ensures master is up to date
safe_run git checkout master
safe_run git pull
safe_run git checkout develop

read VERSION <<< $(safe_run gulp bumpVersion --importance=$IMPORTANCE | awk '/to/ {print $5}')

safe_run git checkout master
safe_run git push
safe_run git checkout develop
safe_run git push

# Start a new release
safe_run git flow release start $VERSION

# This will increment version in package.json
safe_run gulp bumpVersion --write --version=$VERSION

# Ensure dependencies are okay
safe_run yarn

# Rebuild all assets
safe_run gulp build --minify

safe_run git add -A
safe_run git commit -am "Final commit of version $VERSION" --no-edit

info "Logging to npm ...\n"
safe_run yarn login

info "Publishing to npm ...\n"
safe_run yarn publish --new-version $VERSION

# Complete the previous release
safe_run git flow release finish $VERSION -m "Completing release of $VERSION" # This will also tag it

safe_run git push

safe_run git checkout master
safe_run git push --follow-tags

# Prepare the develop branch for the new cycle
safe_run git checkout develop

safe_run unset GIT_MERGE_AUTOEDIT

info "\nAll good. Ready for the next cycle!\n"
