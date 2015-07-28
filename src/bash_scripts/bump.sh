#!/bin/bash
set -e

die() {
    echo >&2 "☠ ☠ ☠ ☠ ☠ ☠ ☠  $@  ☠ ☠ ☠ ☠ ☠ ☠ ☠"
    exit 1
}

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

read VERSION <<< $(gulp bumpVersion --importance=$IMPORTANCE | awk -F 'version to:' '{print $2}')

git checkout master
git push
git checkout develop
git push

# Start a new release
git flow release start $VERSION

# This will increment version in package.json
gulp bumpVersion --write --version=$VERSION

# Ensure dependencies are okay
npm prune
npm install

# Rebuild all assets
gulp build --minify

# Ensures nothing is broken
npm test

git add -A
git commit -am "Version $VERSION"

npm publish

# Complete the previous release
git flow release finish $VERSION -m "Version $VERSION" # This will also tag it
git checkout master
git push
git push --tags

# Prepare the develop branch for the new cycle
git checkout develop
