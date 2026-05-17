# Amazon Desponsor

A browser extension that hides or highlights sponsored products in Amazon search results.

## Install

- **Chrome Web Store:** _coming soon_
- **Firefox Add-ons:** _coming soon_

To install from source, build it (see below) and load the output directory as an unpacked extension.

## Features

- **Hide** sponsored items entirely
- **Highlight** sponsored items in a color of your choice
- Toolbar badge showing how many sponsored items were treated on the current page
- Covers standard product tiles, sponsored brand video banners, themed-collection carousels, skyscraper ads, and "Customers frequently viewed" sections

## Development

```sh
just install   # install dependencies
just dev       # run with HMR
just build     # production build → .output/
just check     # type + svelte check
just format    # run all prek hooks
```
