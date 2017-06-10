#!/bin/bash
set -e

export GIT_MERGE_AUTOEDIT=no

die() {
    unset GIT_MERGE_AUTOEDIT
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

read VERSION <<< $(gulp bumpVersion --importance=$IMPORTANCE | awk '/to/ {print $5}')

# Ensures nothing is broken
npm test

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

# Ensures again that nothing is broken with the build
npm test

git add -A
git commit -am "Final commit of version $VERSION" --no-edit

echo "Publishing to npm ..."
npm publish

# Complete the previous release
git flow release finish $VERSION -m "Completing release of $VERSION" # This will also tag it

git push

git checkout master
git push
git push --tags

# Prepare the develop branch for the new cycle
git checkout develop

unset GIT_MERGE_AUTOEDIT

echo "All good. Ready for the next cycle!"
