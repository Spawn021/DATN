import React from 'react'
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'
const Congrate = () => {
    const { width, height } = useWindowSize()
    return (
        <Confetti
            width={width}
            height={height}
        />
    )
}

export default Congrate