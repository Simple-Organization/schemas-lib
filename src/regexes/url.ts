import type { ParseContext } from '../version2/types';
import { Schema } from '../version2/Schema';
import { hostname_regex } from './zodRegexes';

//
//

export class URLSchema extends Schema<string> {
  process(p: ParseContext): void {
    if (typeof p.value !== 'string') return p.error('not_string_type');

    if (!p.value.startsWith('http://') && !p.value.startsWith('https://')) {
      p.value = 'http://' + p.value;
    }

    try {
      const url = new URL(p.value);
      hostname_regex.lastIndex = 0;
      if (!hostname_regex.test(url.hostname)) return p.error('not_url');
    } catch (_) {
      return p.error('not_url');
    }
  }
}

/**
 * Checks if the value is a valid URL
 */
export function url() {
  return new URLSchema();
}
