# mensch history

## 0.3.1 - 1 Dec 2013

- Retain whitespace in selectors. Closes #8
- Add support for `@-ms-keyframes`.

## 0.3.0 - 23 Nov 2013

- Improve handling of quotes in values. Closes #5
- Add support for `@document` (and `@-moz-document`), `@namespace` and `@page`.

## 0.2.1 - 20 Sep 2013

- Trim whitespace around grouped selectors.

## 0.2.0 - 18 Sep 2013

- Correctly handle comments as children of at-groups. Fix #2

## 0.1.0 - 17 Jun 2013

- Added new boolean `position` option to `parse()`, which will include position
  data in the AST when enabled.
- Moved node.selector to node.selectors, and changed the value to an array.
- Various parser improvements and bug fixes.

## 0.0.1 - 11 Jun 2013

- Initial release.
