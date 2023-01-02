import { Fragment, ReactNode, useEffect, useState } from "react"
import { ClientData } from "../types/client"
import { useRouter } from "next/router"

type Props = {
    children?: ReactNode
    status: ClientData
    pc: string
}

function selectIcon(osName: string): string {
    switch (true) {
        case /Windows/.test(osName):
            return "/icon/os/windows.svg"
        case /Debian/.test(osName):
            return "/icon/os/debian.svg"
        case /Raspbian/.test(osName):
            return "/icon/os/raspbian.svg"
        case /Ubuntu/.test(osName):
            return "/icon/os/ubuntu.svg"
        case /Arch/.test(osName):
            return "/icon/os/arch.svg"
        case /Fedora/.test(osName):
            return "/icon/os/fedora.svg"
        case /Darwin/.test(osName):
            return "/icon/os/apple.svg"
        default:
            return "/icon/os/linux.svg"
    }
}

function usageBarColor(percent: Number): string {
    if (percent > 90) return "error"
    if (percent > 75) return "warning"
    return "info"
}

const Status = ({ children, status, pc }: Props) => {
    const [hash, setHash] = useState({})
    const { isReady } = useRouter()

    useEffect(() => {
        if (isReady) {
            const hashData = decodeURI(location.hash.replace(/#/, ""))
            const border =
                hashData === (status || {})[pc]?.hostname
                    ? {
                          border: "solid",
                      }
                    : {}
            setHash(border)
        }
    }, [isReady])

    useEffect(() => {
        addEventListener("hashchange", (e) => {
            const hashData = decodeURI(location.hash.replace(/#/, ""))
            const border =
                hashData === (status || {})[pc]?.hostname
                    ? {
                          border: "solid",
                      }
                    : {}
            setHash(border)
        })
    }, [])

    return (
        <Fragment key={pc}>
            <div
                className="card w-128 bg-base-60 shadow-xl"
                id={(status || {})[pc]?.hostname}
                style={hash}
            >
                <div className="card-body">
                    <div className="avatar center">
                        <div className="w-12">
                            <img src={selectIcon((status || {})[pc]?._os)} />
                        </div>
                    </div>
                    <h2 className="card-title">
                        {(status || {})[pc]?.hostname}
                    </h2>

                    <div className="stats shadow">
                        <div className="stat">
                            <div className="stat-figure text-secondary"></div>
                            <div className="stat-title">CPU</div>
                            <div className="stat-value">
                                {(status || {})[pc]?.cpu.percent}%
                            </div>
                            <div className="stat-desc">
                                <progress
                                    className={`progress progress-${usageBarColor(
                                        (status || {})[pc]?.cpu.percent
                                    )} w-20`}
                                    value={(status || {})[pc]?.cpu.percent}
                                    max="100"
                                />
                            </div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-secondary"></div>
                            <div className="stat-title">RAM</div>
                            <div className="stat-value">
                                {(status || {})[pc]?.ram.percent}%
                            </div>
                            <div className="stat-desc">
                                <progress
                                    className={`progress progress-${usageBarColor(
                                        (status || {})[pc]?.ram.percent
                                    )} w-20`}
                                    value={(status || {})[pc]?.ram.percent}
                                    max="100"
                                />
                            </div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-secondary"></div>
                            <div className="stat-title">Storage</div>
                            <div className="stat-value">
                                {(status || {})[pc]?.storage.percent}%
                            </div>
                            <div className="stat-desc">
                                <progress
                                    className={`progress progress-${usageBarColor(
                                        (status || {})[pc]?.storage.percent
                                    )} w-20`}
                                    value={(status || {})[pc]?.storage.percent}
                                    max="100"
                                />
                            </div>
                        </div>

                        {(status || {})[pc]?.gpu && (
                            <div className="stat">
                                <div className="stat-figure text-secondary"></div>
                                <div className="stat-title">GPU</div>
                                <div className="stat-value">
                                    {(status || {})[pc]?.gpu.usage}%
                                </div>
                                <div className="stat-desc">
                                    <progress
                                        className={`progress progress-${usageBarColor(
                                            (status || {})[pc]?.gpu.usage
                                        )} w-20`}
                                        value={(status || {})[pc]?.gpu.usage}
                                        max="100"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Status
