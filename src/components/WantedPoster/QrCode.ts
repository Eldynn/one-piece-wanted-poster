import QrCode from 'qrcode'

import type { PosterRenderingContext2D } from './types'
import { loadImage } from './utils'

export default class QrCodeImage {
  #ctx: PosterRenderingContext2D
  shadow = 0

  #imageScale = 1

  #image: HTMLImageElement | null = null

  constructor(ctx: PosterRenderingContext2D) {
    this.#ctx = ctx
  }

  async loadImage(url: string | null) {
    if (!url) {
      return
    }

    let image
    try {
      const qrCodeUrl = await QrCode.toDataURL(url, {
        errorCorrectionLevel: 'H'
        // width: 64
      })
      console.log({ qrCodeUrl })

      image = await loadImage(qrCodeUrl)
      this.#image = image
    } catch (error) {
      console.error(error)
      throw new Error('Failed to load wanted image.')
    }

    return image
  }

  get imageScale() {
    return this.#imageScale
  }

  render(): void {
    if (!this.#image) {
      return
    }

    const { x, y, width, height } = {
      x: 65,
      y: 195,
      width: this.#image.width,
      height: this.#image.height
    }
    this.#ctx.drawImage(this.#image, x, y, width, height)

    this.#ctx.restore()
  }
}
