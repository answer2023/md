import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { getDefaultContent } from './default-content'

/**
 * The WeChat QR ships twice on purpose: AboutDialog imports the bundled copy (hashed,
 * works offline and under any base path) while the example documents link the public
 * copy by absolute URL so WeChat itself can fetch it. Nothing in the build keeps them
 * in sync, so replacing only one would silently show two different QR codes.
 */
const BUNDLED_QRCODE = fileURLToPath(new URL(`../images/wechat-mp-qrcode.jpg`, import.meta.url))
const PUBLIC_QRCODE = fileURLToPath(new URL(`../../../public/assets/wechat-mp-qrcode.jpg`, import.meta.url))
const QRCODE_URL = `https://md.tangzhihong.com/assets/wechat-mp-qrcode.jpg`

describe(`wechat QR assets`, () => {
  it(`keeps the bundled and public copies byte-identical`, () => {
    expect(readFileSync(PUBLIC_QRCODE).equals(readFileSync(BUNDLED_QRCODE))).toBe(true)
  })

  it(`links the same QR URL from every locale sample`, () => {
    for (const locale of [`zh-CN`, `zh-TW`, `en-US`, `ja-JP`] as const)
      expect(getDefaultContent(locale)).toContain(QRCODE_URL)
  })
})
