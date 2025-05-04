////////////////////////////////////////////////////////////
/////     All regexes here were taken from Zod v4     //////
////////////////////////////////////////////////////////////

export const cuid_regex: RegExp = /^[cC][^\s-]{8,}$/;
export const cuid2_regex: RegExp = /^[0-9a-z]+$/;
export const ulid_regex: RegExp = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
export const xid_regex: RegExp = /^[0-9a-vA-V]{20}$/;
export const ksuid_regex: RegExp = /^[A-Za-z0-9]{27}$/;
export const nanoid_regex: RegExp = /^[a-zA-Z0-9_-]{21}$/;

/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
export const duration_regex: RegExp =
  /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;

/** Implements ISO 8601-2 extensions like explicit +- prefixes, mixing weeks with other units, and fractional/negative components. */
export const extendedDuration_regex: RegExp =
  /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;

/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
export const guid_regex: RegExp =
  /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;

/** Returns a regex for validating an RFC 4122 UUID.
 *
 * @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
export const uuid_regex = (version?: number | undefined): RegExp => {
  if (!version)
    return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$/;
  return new RegExp(
    `^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`,
  );
};
export const uuid4_regex: RegExp = uuid_regex(4);
export const uuid6_regex: RegExp = uuid_regex(6);
export const uuid7_regex: RegExp = uuid_regex(7);

/** Practical email validation */
export const email_regex: RegExp =
  /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;

/** Equivalent to the HTML5 input[type=email] validation implemented by browsers. Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email */
export const html5Email_regex: RegExp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/** The classic emailregex.com regex for RFC 5322-compliant emails */
export const rfc5322Email_regex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/** A loose regex that allows Unicode characters, enforces length limits, and that's about it. */
export const unicodeEmail_regex = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u;

export const browserEmail_regex: RegExp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
// from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression

export const _emoji_regex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
export function emoji_regex(): RegExp {
  return new RegExp(_emoji_regex, 'u');
}

export const ipv4_regex: RegExp =
  /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
export const ipv6_regex: RegExp =
  /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})$/;

export const cidrv4_regex: RegExp =
  /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
export const cidrv6_regex: RegExp =
  /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;

export const ip_regex: RegExp = new RegExp(
  `(${ipv4_regex.source})|(${ipv6_regex.source})`,
);

// https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
export const base64_regex: RegExp =
  /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
export const base64url_regex: RegExp =
  /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;

// based on https://stackoverflow.com/questions/106179/regular-expression-to-match-dns-hostname-or-ip-address
export const hostname_regex: RegExp =
  /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;

// https://blog.stevenlevithan.com/archives/validate-phone-number#r4-3 (regex sans spaces)
export const e164_regex: RegExp = /^\+(?:[0-9]){6,14}[0-9]$/;

const dateSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
export const date_regex: RegExp = new RegExp(`^${dateSource}$`);

function timeSource(args: { precision?: number | null }) {
  // let regex = `\\d{2}:\\d{2}:\\d{2}`;
  let regex = `([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d`;

  if (args.precision) {
    regex = `${regex}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    regex = `${regex}(\\.\\d+)?`;
  }
  return regex;
}
export function time_regex(args: { precision?: number | null }): RegExp {
  return new RegExp(`^${timeSource(args)}$`);
}

// Adapted from https://stackoverflow.com/a/3143231
export function datetime_regex(args: {
  precision?: number | null;
  offset?: boolean;
  local?: boolean;
}): RegExp {
  let regex = `${dateSource}T${timeSource(args)}`;

  const opts: string[] = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset) opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join('|')})`;
  return new RegExp(`^${regex}$`);
}

export const string_regex = (params?: {
  minimum?: number;
  maximum?: number;
}): RegExp => {
  const regex = params
    ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ''}}`
    : `[\\s\\S]*`;
  return new RegExp(`^${regex}$`);
};

export const bigint_regex: RegExp = /^\d+n?$/;
export const integer_regex: RegExp = /^\d+$/;
export const number_regex: RegExp = /^-?\d+(?:\.\d+)?/i;
export const boolean_regex: RegExp = /true|false/i;
const _null_regex: RegExp = /null/i;
export { _null_regex as null_regex };
const _undefined_regex: RegExp = /undefined/i;
export { _undefined_regex as undefined_regex };

// regex for string with no uppercase letters
export const lowercase_regex: RegExp = /^[^A-Z]*$/;
// regex for string with no lowercase letters
export const uppercase_regex: RegExp = /^[^a-z]*$/;
