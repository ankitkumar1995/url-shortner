/**
 * Thread-safe, highly optimized Base62 Encoder and Decoder.
 * Converts numeric database keys (e.g. Snowflake IDs) into compact,
 * URL-friendly short codes.
 */

const BASE62_CHARSET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class Base62Converter {
  /**
   * Encodes a numeric 64-bit integer into a Base62 string.
   * @param num BigInt or number to encode.
   * @returns Base62 representation of the number.
   */
  public static encode(num: bigint | number): string {
    let value = BigInt(num);
    if (value === 0n) return BASE62_CHARSET[0];

    let result = "";
    const base = 62n;

    while (value > 0n) {
      const remainder = value % base;
      result = BASE62_CHARSET.charAt(Number(remainder)) + result;
      value = value / base;
    }

    return result;
  }

  /**
   * Decodes a Base62 string back into its original numeric BigInt ID.
   * @param str Base62 string to decode.
   * @returns BigInt representation of the decoded ID.
   */
  public static decode(str: string): bigint {
    let result = 0n;
    const base = 62n;

    for (let i = 0; i < str.length; i++) {
      const char = str.charAt(i);
      const index = BigInt(BASE62_CHARSET.indexOf(char));
      if (index === -1n) {
        throw new Error(`Invalid Base62 character: ${char}`);
      }
      result = result * base + index;
    }

    return result;
  }
}
