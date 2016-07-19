#!/bin/sh

./bin/locally.js -i demo/Demo -o demo/Demo/en.lproj/Localizable.strings
./bin/locally.js -i demo/Demo -o demo/Demo/sv.lproj/Localizable.strings

./bin/locally.js \
    -i demo/Demo \
    -o demo/Demo/en.lproj/Localizable.strings \
    -p "NSLocalizedString(@(), .*)" \
    -p "@().localize" \

