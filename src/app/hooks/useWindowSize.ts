import { useEffect, useState } from 'react'

const isClient = typeof window === 'object'

type ISize = {
    width: number | undefined
    height: number | undefined
}

function getSize(): ISize {
    return {
        width: isClient ? window.innerWidth : undefined,
        height: isClient ? window.innerHeight : undefined
    }
}

// https://usehooks.com/useWindowSize/
export default function useWindowSize(): ISize {
    const [windowSize, setWindowSize] = useState(getSize)

    useEffect(() => {
        function handleResize(): void {
            setWindowSize(getSize())
        }

        if (isClient) {
            window.addEventListener('resize', handleResize)
            return () => {
                window.removeEventListener('resize', handleResize)
            }
        }
        return undefined
    }, [])

    return windowSize
}

// export function resize(): { height: number; width: number } {
//     const [size, setSize] = useState({
//         width: document.documentElement.clientWidth,
//         height: document.documentElement.clientHeight
//     })

//     const onResize = useCallback(() => {
//         setSize({
//             width: document.documentElement.clientWidth,
//             height: document.documentElement.clientHeight
//         })
//     }, [])

//     useEffect(() => {
//         window.addEventListener('resize', onResize)
//         return () => {
//             window.removeEventListener('resize', onResize)
//         }
//     }, [])

//     return size
// }
