![](logo.png)

[![](https://img.shields.io/badge/contact-@thematerik-blue.svg?style=flat-square)](http://twitter.com/thematerik)
[![](https://img.shields.io/travis/materik/locally.svg?style=flat-square)](https://travis-ci.org/materik/locally)

Node package for going through your Xcode project, locating all localized
strings and add them to your `Localizable.strings` files. Also sorts and groups
the strings if they are new, in used or unused.

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
              Supports multiple arguments.

    -o, --output <OUTPUT>
            Filepath to where the localized strings be saved, example:
            'Resources/en.lproj/Localizable.strings'.
              Supports multiple arguments.

    -p, --pattern <PATTERN>
            How should the localized file be found, by default: 'NSLocalizedString(@?(), .*)',
            where '()' will be picked out as the string.
              Supports multiple arguments.
```

### Example

```
locally \
    -i MyProject \
    -o MyProject/en.lproj/Localizable.strings \
    -o MyProject/sv.lproj/Localizable.strings \
    -p "@().localize" \
    -p "localize(@())"
```

### Ignore

You can choose for Locally to ignore some strings in both your
`Localizable.strings` file and in the project.

* Add `// locally ignore: lint` on the end of each line in your project that you want to ignore
* Add ignored strings under the section `/\* Ignored strings \*/` in your `Localizable.strings` file to have Locally skip them.

See `Demo` for an example of how to use it.

## Demo

Open the `Demo.xcodeproj`. Look into the `Localizable.strings` files and see the
`ViewController` class. Now, go to the root folder in the terminal and execute:
`npm run demo`. See how the `Localizable.strings` files changes with the runs.

## Test

There are multiple tests for the package. You can run them locally by executing:
`npm test`.

## Notes

- Will attempt to make this into a Xcode plugin.

