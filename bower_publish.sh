#!/bin/bash

git clone "https://${GH_TOKEN}@github.com/dolcalmi/bower-stellar-auth-client.git" bower

if [ ! -d "bower" ]; then
  echo "Error cloning"
  exit 1
fi

cp dist/* bower
cd bower
git add .
git commit -m $TRAVIS_TAG
git tag -a $TRAVIS_TAG -m $TRAVIS_TAG
git push origin master --tags
cd ..
rm -rf bower
