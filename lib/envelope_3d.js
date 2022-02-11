module.exports = function () {
  /**
   * A 3D bounding box. For 2D envelopes, see {@link Envelope}
   *
   * (Pure-javascript implementation of [OGREnvelope3D](http://www.gdal.org/classOGREnvelope3D.html))
   *
   * @constructor
   * @class Envelope3D
   * @param {object} [bounds] An object containing `minX`, `maxX`, `minY`, `maxY`, `minZ`, and `maxZ` values.
   * @property {number} minX
   * @property {number} maxX
   * @property {number} minY
   * @property {number} maxY
   * @property {number} minZ
   * @property {number} maxZ
   */
  const Envelope3D = module.exports = function Envelope3D(envelope) {
    if (envelope) {
      this.minX = envelope.minX
      this.minY = envelope.minY
      this.minZ = envelope.minZ || 0
      this.maxX = envelope.maxX
      this.maxY = envelope.maxY
      this.maxZ = envelope.maxZ || 0
    } else {
      this.minX = 0
      this.minY = 0
      this.minZ = 0
      this.maxX = 0
      this.maxY = 0
      this.maxZ = 0
    }
  }

  /**
   * Determines if the envelope has not been set yet.
   *
   * @function isEmpty
   * @memberof Envelope3D
   * @return {boolean}
   */
  Envelope3D.prototype.isEmpty = function () {
    return !(
      this.minX ||
      this.minY ||
      this.minZ ||
      this.maxX ||
      this.maxY ||
      this.maxZ
    )
  }

  /**
   * Unions the provided envelope with the current envelope.
   *
   * @function merge
   * @memberof Envelope3D
   * @param {Envelope3D} envelope
   * @return {void}
   */

  /**
   * Unions the provided envelope with the x/y/z coordinates provided.
   *
   * @function merge
   * @memberof Envelope3D
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @return {void}
   */
  Envelope3D.prototype.merge = function (envelope) {
    if (arguments.length === 1) {
      if (this.isEmpty()) {
        this.minX = envelope.minX
        this.maxX = envelope.maxX
        this.minY = envelope.minY
        this.maxY = envelope.maxY
        this.minZ = envelope.minZ
        this.maxZ = envelope.maxZ
      } else {
        this.minX = Math.min(envelope.minX, this.minX)
        this.maxX = Math.max(envelope.maxX, this.maxX)
        this.minY = Math.min(envelope.minY, this.minY)
        this.maxY = Math.max(envelope.maxY, this.maxY)
        this.minZ = Math.min(envelope.minZ, this.minZ)
        this.maxZ = Math.max(envelope.maxZ, this.maxZ)
      }
    } else {
      const x = arguments[0]
      const y = arguments[1]
      const z = arguments[2]
      if (this.isEmpty()) {
        this.minX = this.maxX = x
        this.minY = this.maxY = y
        this.minZ = this.maxZ = z
      } else {
        this.minX = Math.min(x, this.minX)
        this.maxX = Math.max(x, this.maxX)
        this.minY = Math.min(y, this.minY)
        this.maxY = Math.max(y, this.maxY)
        this.minZ = Math.min(z, this.minZ)
        this.maxZ = Math.max(z, this.maxZ)
      }
    }
  }

  /**
   * Determines if the provided envelope touches it.
   *
   * @function intersects
   * @memberof Envelope3D
   * @param {Envelope3D} envelope
   * @return {boolean}
   */
  Envelope3D.prototype.intersects = function (envelope) {
    return (
      this.minX <= envelope.maxX &&
      this.maxX >= envelope.minX &&
      this.minY <= envelope.maxY &&
      this.maxY >= envelope.minY &&
      this.minZ <= envelope.maxZ &&
      this.maxZ >= envelope.minZ
    )
  }

  /**
   * Updates the envelope to the intersection of the two envelopes.
   *
   * @function intersect
   * @memberof Envelope3D
   * @param {Envelope3D} envelope
   * @return {void}
   */
  Envelope3D.prototype.intersect = function (envelope) {
    if (this.intersects(envelope)) {
      if (this.isEmpty()) {
        this.minX = envelope.minX
        this.maxX = envelope.maxX
        this.minY = envelope.minY
        this.maxY = envelope.maxY
        this.minZ = envelope.minZ
        this.maxZ = envelope.maxZ
      } else {
        this.minX = Math.max(envelope.minX, this.minX)
        this.maxX = Math.min(envelope.maxX, this.maxX)
        this.minY = Math.max(envelope.minY, this.minY)
        this.maxY = Math.min(envelope.maxY, this.maxY)
        this.minZ = Math.max(envelope.minZ, this.minZ)
        this.maxZ = Math.min(envelope.maxZ, this.maxZ)
      }
    } else {
      this.minX = this.maxX = this.minY = this.maxY = this.minZ = this.maxZ = 0
    }
  }

  /**
   * Determines if the provided envelope is wholly-contained by the current envelope.
   *
   * @function contains
   * @memberof Envelope3D
   * @param {Envelope3D} envelope
   * @return {boolean}
   */
  Envelope3D.prototype.contains = function (envelope) {
    return (
      this.minX <= envelope.minX &&
      this.minY <= envelope.minY &&
      this.minZ <= envelope.minZ &&
      this.maxX >= envelope.maxX &&
      this.maxY >= envelope.maxY &&
      this.maxZ >= envelope.maxZ
    )
  }

  return Envelope3D
}
