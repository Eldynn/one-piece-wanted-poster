import QrCode from 'qrcode'

import { getFitScale, loadImage } from './utils'
import GraphicObject from './GraphicObject'
import { Position } from './types'

const QR_CODE_SIZE = 96

export default class QrCodeImage extends GraphicObject {
  shadow = 0

  #imageScale = 1
  #renderPosition: Position = {
    x: 80,
    y: 255,
    width: QR_CODE_SIZE,
    height: QR_CODE_SIZE
  }

  #image: HTMLImageElement | null = null

  async loadImage(url: string | null) {
    if (!url) {
      return
    }

    let image
    try {
      const qrCodeUrl = await QrCode.toDataURL(url, {
        errorCorrectionLevel: 'H',
        width: QR_CODE_SIZE
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

  scale(scale: number) {
    super.scale(scale)
    this.updateRenderPosition()
  }

  updateRenderPosition() {
    if (!this.#image) {
      return
    }

    const scale = getFitScale(
      this.width,
      this.height,
      this.#image.width,
      this.#image.height
    )

    // The size of scaled image may be smaller than photo area, so here we
    // calculate render position to put the scaled image to the center of photo area.
    const width = this.#image.width * scale
    const height = this.#image.height * scale

    const x = this.x + (this.width - width) / 2
    const y = this.y + (this.height - height) / 2

    this.#renderPosition = { x, y, width, height }
    this.#imageScale = scale
  }

  render(): void {
    if (!this.#image) {
      return
    }

    const { x, y, width, height } = this.#renderPosition
    this.ctx.drawImage(this.#image, x, y, width, height)

    this.ctx.restore()
  }
}
