module.exports = function (gdal) {
  /**
   * A 2D bounding box. For 3D envelopes, see {@link Envelope3D}
   *
   * (Pure-javascript implementation of [OGREnvelope](https://gdal.org/doxygen/classOGREnvelope.html))
   *
   * @constructor
   * @class Envelope
   * @param {object} [bounds] An object containing `minX`, `maxX`, `minY`, and `maxY` values.
   * @property {number} minX
   * @property {number} maxX
   * @property {number} minY
   * @property {number} maxY
   */
  const Envelope = function Envelope(envelope) {
    if (envelope) {
      this.minX = envelope.minX
      this.minY = envelope.minY
      this.maxX = envelope.maxX
      this.maxY = envelope.maxY
    } else {
      this.minX = 0
      this.minY = 0
      this.maxX = 0
      this.maxY = 0
    }
  }

  /**
   * Determines if the envelope has not been set yet.
   *
   * @function isEmpty
   * @memberof Envelope
   * @return {boolean}
   */
  Envelope.prototype.isEmpty = function () {
    return !(this.minX || this.minY || this.maxX || this.maxY)
  }

  /**
   * Unions the provided envelope with the current envelope.
   *
   * @function merge
   * @memberof Envelope
   * @param {Envelope} envelope
   * @return {void}
   */

  /**
   * Unions the provided envelope with the x/y coordinates provided.
   *
   * @function merge
   * @memberof Envelope
   * @param {number} x
   * @param {number} y
   * @return {void}
   */
  Envelope.prototype.merge = function (envelope) {
    if (arguments.length === 1) {
      if (this.isEmpty()) {
        this.minX = envelope.minX
        this.maxX = envelope.maxX
        this.minY = envelope.minY
        this.maxY = envelope.maxY
      } else {
        this.minX = Math.min(envelope.minX, this.minX)
        this.maxX = Math.max(envelope.maxX, this.maxX)
        this.minY = Math.min(envelope.minY, this.minY)
        this.maxY = Math.max(envelope.maxY, this.maxY)
      }
    } else {
      const x = arguments[0]
      const y = arguments[1]
      if (this.isEmpty()) {
        this.minX = this.maxX = x
        this.minY = this.maxY = y
      } else {
        this.minX = Math.min(x, this.minX)
        this.maxX = Math.max(x, this.maxX)
        this.minY = Math.min(y, this.minY)
        this.maxY = Math.max(y, this.maxY)
      }
    }
  }

  /**
   * Determines if the provided envelope touches it.
   *
   * @function intersects
   * @memberof Envelope
   * @param {Envelope} envelope
   * @return {boolean}
   */
  Envelope.prototype.intersects = function (envelope) {
    return (
      this.minX <= envelope.maxX &&
      this.maxX >= envelope.minX &&
      this.minY <= envelope.maxY &&
      this.maxY >= envelope.minY
    )
  }

  /**
   * Updates the envelope to the intersection of the two envelopes.
   *
   * @function intersect
   * @memberof Envelope
   * @param {Envelope} envelope
   * @return {void}
   */
  Envelope.prototype.intersect = function (envelope) {
    if (this.intersects(envelope)) {
      if (this.isEmpty()) {
        this.minX = envelope.minX
        this.maxX = envelope.maxX
        this.minY = envelope.minY
        this.maxY = envelope.maxY
      } else {
        this.minX = Math.max(envelope.minX, this.minX)
        this.maxX = Math.min(envelope.maxX, this.maxX)
        this.minY = Math.max(envelope.minY, this.minY)
        this.maxY = Math.min(envelope.maxY, this.maxY)
      }
    } else {
      this.minX = this.maxX = this.minY = this.maxY = 0
    }
  }

  /**
   * Determines if the provided envelope is wholly-contained by the current envelope.
   *
   * @function contains
   * @memberof Envelope
   * @param {Envelope} envelope
   * @return {boolean}
   */
  Envelope.prototype.contains = function (envelope) {
    return (
      this.minX <= envelope.minX &&
      this.minY <= envelope.minY &&
      this.maxX >= envelope.maxX &&
      this.maxY >= envelope.maxY
    )
  }

  /**
   * Converts the envelope to a polygon.
   *
   * @function toPolygon
   * @memberof Envelope
   * @return {Polygon}
   */
  Envelope.prototype.toPolygon = function () {
    const polygon = new gdal.Polygon()
    const ring = new gdal.LinearRing()
    ring.points.add(this.minX, this.minY)
    ring.points.add(this.maxX, this.minY)
    ring.points.add(this.maxX, this.maxY)
    ring.points.add(this.minX, this.maxY)
    ring.points.add(this.minX, this.minY)
    polygon.rings.add(ring)
    return polygon
  }

  return Envelope
}
