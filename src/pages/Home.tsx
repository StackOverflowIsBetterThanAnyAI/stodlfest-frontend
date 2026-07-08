import { useCallback, useEffect, useState } from 'react'

const Home = () => {
    const targetDate = new Date('2026-09-05T18:30:00').getTime()

    const [days, setDays] = useState<number>(() => {
        const delta = targetDate - Date.now()
        const d = Math.floor(delta / (1000 * 60 * 60 * 24))
        return d > 0 ? d : 0
    })
    const [hours, setHours] = useState<number>(() => {
        const delta = targetDate - Date.now()
        const h = Math.floor(delta / (1000 * 60 * 60)) % 24
        return h > 0 ? h : 0
    })
    const [minutes, setMinutes] = useState<number>(() => {
        const delta = targetDate - Date.now()
        const m = Math.floor(delta / (1000 * 60)) % 60
        return m > 0 ? m : 0
    })
    const [seconds, setSeconds] = useState<number>(() => {
        const delta = targetDate - Date.now()
        const s = Math.floor(delta / 1000) % 60
        return s > 0 ? s : 0
    })

    const calculateTimeLeft = useCallback(() => {
        const currentDate = Date.now()
        const delta = targetDate - currentDate

        if (delta <= 0) {
            setDays(0)
            setHours(0)
            setMinutes(0)
            setSeconds(0)
            return
        }

        setDays(Math.floor(delta / (1000 * 60 * 60 * 24)))
        setHours(Math.floor(delta / (1000 * 60 * 60)) % 24)
        setMinutes(Math.floor(delta / (1000 * 60)) % 60)
        setSeconds(Math.floor(delta / 1000) % 60)
    }, [targetDate])

    const formatNumber = (num: number) => {
        return num < 10 ? `0${num}` : num
    }

    useEffect(() => {
        const id = setInterval(() => {
            calculateTimeLeft()
        }, 1000)

        return () => clearInterval(id)
    }, [calculateTimeLeft])

    return (
        <main className="max-w-7xl w-full mx-auto items-center p-4 md:p-8 flex flex-col gap-8 xs:gap-16">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold flex flex-wrap justify-center text-center items-center gap-4">
                Countdown bis zum
                <span className="font-yesteryear font-light text-5xl xs:text-6xl sm:text-7xl md:text-9xl">
                    Stodlfest
                </span>
            </h1>
            <div className="sr-only" aria-live="polite" aria-atomic="true">
                {days ? `${days} Tage, ` : ''}
                {hours} Stunden, {minutes} Minuten und {seconds} Sekunden
            </div>
            <div
                aria-hidden="true"
                className="flex flex-col items-center gap-4 outline-0 xs:outline-4 outline-zinc-200 outline-offset-16 rounded-lg"
            >
                <div className="flex text-5xl xs:text-6xl sm:text-7xl md:text-8xl tabular-nums font-mono">
                    {days ? (
                        <>
                            <span>{formatNumber(days)}</span>
                            <span>:</span>
                        </>
                    ) : undefined}
                    <span>{formatNumber(hours)}</span>
                    <span>:</span>
                    <span>{formatNumber(minutes)}</span>
                    <span>:</span>
                    <span>{formatNumber(seconds)}</span>
                </div>
                <div className="flex gap-2 xs:gap-3 xs:text-xl sm:text-2xl md:text-3xl">
                    {days ? (
                        <>
                            <span>Tage</span>
                            <span>-</span>
                        </>
                    ) : undefined}
                    <span>Stunden</span>
                    <span>-</span>
                    <span>Minuten</span>
                    <span>-</span>
                    <span>Sekunden</span>
                </div>
            </div>
        </main>
    )
}

export default Home
