// components/Spinner.jsx
import React, { useEffect, useState } from 'react'

const Spinner = ({ size = 40, className = '' }) => {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 45) % 360)
    }, 125)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`spinner-container ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="currentColor">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
            const segmentRotation = index * 45
            const opacityIndex =
              (8 + Math.floor((rotation - segmentRotation) / 45)) % 8
            const opacity = 1 - opacityIndex * 0.125

            return (
              <rect
                key={index}
                x="11"
                y="1"
                width="2"
                height="5"
                rx="1"
                fillOpacity={opacity}
                transform={`rotate(${segmentRotation} 12 12)`}
              />
            )
          })}
        </g>
      </svg>
    </div>
  )
}
export default Spinner
