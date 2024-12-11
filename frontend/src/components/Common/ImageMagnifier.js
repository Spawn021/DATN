import React, { useState, memo } from 'react'

function ImageMagnifier({ src, width = 'auto', height = 'auto', magnifierHeight = 150, magnifierWidth = 150, zoomLevel = 2 }) {
   const [[x, y], setXY] = useState([0, 0])
   const [[imgWidth, imgHeight], setSize] = useState([0, 0])
   const [showMagnifier, setShowMagnifier] = useState(false)

   return (
      <div
         style={{
            position: 'relative',
            height: height,
            width: width,
         }}
      >
         <img
            src={src}
            style={{ height: height, width: width, objectFit: 'contain' }}
            onMouseEnter={(e) => {
               const elem = e.currentTarget
               const { width, height } = elem.getBoundingClientRect()
               setSize([width, height])
               setShowMagnifier(true)
            }}
            onMouseMove={(e) => {
               const elem = e.currentTarget
               const { top, left } = elem.getBoundingClientRect()

               const x = e.pageX - left - window.pageXOffset
               const y = e.pageY - top - window.pageYOffset
               setXY([x, y])
            }}
            onMouseLeave={() => {
               setShowMagnifier(false)
            }}
            alt={'img'}
         />

         <div
            style={{
               display: showMagnifier ? 'block' : 'none',
               position: 'absolute',
               pointerEvents: 'none',
               height: `${magnifierHeight}px`,
               width: `${magnifierWidth}px`,
               top: `${y - magnifierHeight / 2}px`,
               left: `${x - magnifierWidth / 2}px`,
               opacity: '1', // Set opacity to 1 to hide the original image beneath
               border: '1px solid lightgray',
               backgroundColor: 'white',
               backgroundImage: `url('${src}')`,
               backgroundRepeat: 'no-repeat',
               backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
               backgroundPosition: `${-x * zoomLevel + magnifierWidth / 2}px ${-y * zoomLevel + magnifierHeight / 2}px`,
            }}
         ></div>
      </div>
   )
}

export default memo(ImageMagnifier)
