import { useState } from 'react'

const ZoomableImage = ({ src, alt }: { src: string; alt: string }): React.ReactElement => {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [start, setStart] = useState({ x: 0, y: 0 })

  const handleWheel = (e: React.WheelEvent): void => {
    e.preventDefault()
    const zoomFactor = 0.1
    if (e.deltaY < 0) {
      setScale((prev) => Math.min(prev + zoomFactor, 5))
    } else {
      setScale((prev) => Math.max(prev - zoomFactor, 1))
    }
  }

  const handleMouseDown = (e: React.MouseEvent): void => {
    setIsDragging(true)
    setStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent): void => {
    if (!isDragging) return
    setPosition({ x: e.clientX - start.x, y: e.clientY - start.y })
  }

  const handleMouseUp = (): void => {
    setIsDragging(false)
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center overflow-hidden cursor-grab"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <img
        src={src}
        alt={alt}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }}
        className="max-w-none select-none flex w-full h-full"
        draggable={false}
      />
    </div>
  )
}

export default ZoomableImage
