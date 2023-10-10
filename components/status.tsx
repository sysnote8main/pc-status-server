import { Fragment, ReactNode, useEffect, useState } from "react"
import { ClientData } from "../types/client"
import { useRouter } from "next/router"
import selectIcon from "../Utils/selectIcon"
import usageBarColor from "../Utils/usageBarColor"
import { getPercent, getCPUPercent } from "../Utils/getPercent"
import styles from "../styles/Status.module.css"
import progressStyle from "../styles/Progress.module.css"

type Props = {
    children?: ReactNode
    status: ClientData
    pc: string
}

const Status = ({ children, status, pc }: Props) => {
    const [hash, setHash] = useState({})
    const { isReady } = useRouter()
    const pcData = (status || {})[pc]
    const cpuPercent = getCPUPercent(pcData.cpu.cpus)
    const ramPercent = getPercent(pcData.ram.free, pcData.ram.total)
    const storages = Array.isArray(pcData.storages) ? pcData.storages : [pcData.storage]
    const storagePercent = getPercent(storages.at(0)!.free, storages.at(0)!.total)

    useEffect(() => {
        if (isReady) {
            const hashData = decodeURI(location.hash.replace(/#/, ""))
            const border =
                hashData === pcData?.hostname
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
                hashData === pcData?.hostname
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
                className={"card bg-base-60 shadow-xl height-5 text-center"}
                id={pcData?.hostname}
                style={hash}
            >
                <div className="card-body">
                    <div className="avatar center">
                        <div className="w-12">
                            <img src={selectIcon(pcData?._os)} />
                        </div>
                    </div>
                    <h2 className="card-title flex justify-between">
                        {pcData?.hostname}
                        <label
                            htmlFor={`focus-${pcData?.hostname}-modal`}
                            className="btn border-none bg-base-50 bg-transparent"
                        >
                            Focus
                        </label>
                    </h2>

                    <div>
                        <p>used version: {pcData.version}</p>
                    </div>

                    <div className="stats shadow">
                        <div className="stat">
                            <div className="stat-figure text-secondary"></div>
                            <div className="stat-title">CPU</div>
                            <div className="stat-value">{cpuPercent}%</div>
                            <div className="stat-desc">
                                <progress
                                    className={`progress progress-${usageBarColor(
                                        cpuPercent
                                    )} w-20 ${progressStyle.progress}`}
                                    value={cpuPercent}
                                    max="100"
                                />
                            </div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-secondary"></div>
                            <div className="stat-title">RAM</div>
                            <div className="stat-value">{ramPercent}%</div>
                            <div className="stat-desc">
                                <progress
                                    className={`progress progress-${usageBarColor(
                                        ramPercent
                                    )} w-20 ${progressStyle.progress}`}
                                    value={ramPercent}
                                    max="100"
                                />
                            </div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-secondary"></div>
                            <div className="stat-title">Storage</div>
                            <div className="stat-value">{storagePercent}%</div>
                            <div className="stat-desc">
                                <progress
                                    className={`progress progress-${usageBarColor(
                                        storagePercent
                                    )} w-20 ${progressStyle.progress}`}
                                    value={storagePercent}
                                    max="100"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-secondary"></div>
                        <div className="stat-title">GPU</div>
                        <div className="stat-value">
                            {(status || {})[pc]?.gpu ? (
                                <>{(status || {})[pc]?.gpu.usage}%</>
                            ) : (
                                <>NaN%</>
                            )}
                        </div>
                        <div className="stat-desc">
                            {(status || {})[pc]?.gpu ? (
                                <progress
                                    className={`progress progress-${usageBarColor(
                                        (status || {})[pc]?.gpu.usage
                                    )} w-20 ${progressStyle.progress}`}
                                    value={(status || {})[pc]?.gpu.usage}
                                    max="100"
                                />
                            ) : (
                                <progress
                                    className={`progress w-20`}
                                    value={0}
                                    max="100"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Status
