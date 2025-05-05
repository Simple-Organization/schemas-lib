import { Issue } from './Issue';
import { trimmed } from './parsers/string';

//
//  Date - Created by Copilot
//  very simple date regex, probably not the best
export function date() {
  return trimmed().addParser(function dateParser(value, meta, originalValue) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Issue('not_date', meta, originalValue);
    }

    return value;
  });
}

/**
 * Must start with a letter
 *
 * Can have letters, numbers and spaces
 */
export function nameField() {
  return trimmed().addParser(
    function nameFieldParser(value, meta, originalValue) {
      if (!/^[a-zA-Z\u00C0-\u00FF]{2}[a-zA-Z\u00C0-\u00FF0-9 ]*$/.test(value)) {
        return new Issue('not_namefield', meta, originalValue);
      }

      return value;
    },
  );
}
