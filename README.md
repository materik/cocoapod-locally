![](logo.png)

[![](https://img.shields.io/badge/contact-@thematerik-blue.svg?style=flat-square)](http://twitter.com/thematerik)

Node package for going through your Xcode project, locating all localized
strings and add them to your `Localizable.strings` file. Also sorts and groups
the strings if they are still used or not.

## Install

```
npm install -g materik/locally
```

## Usage

```
locally -i <INPUT> -o <OUTPUT> [-p <PATTERN>]

    -i, --input <INPUT>
            Filepath to the project where the recursive lookthrough
            for localized strings should take place.

    -o, --output <OUTPUT>
            Filepath to where the localized strings be saved, example:
            'Resources/en.lproj/Localizable.strings'.

    -p, --pattern <PATTERN>
            How should the localized file be found, by default: 'NSLocalizedString\(@(), .*\);',
            where '()' will be picked out as the string.
```

## Demo

Open the `Demo.xcodeproj`. Look into the `Localizable.strings` files and see the
`ViewController` class. Now go to the `demo` folder and execute `./localize.sh`.
See how the `Localizable.strings` files have changed.

## Notes

- Will make this into a Xcode plugin

