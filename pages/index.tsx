import Head from "next/head"
import io, { Socket } from "socket.io-client"
import { useRouter } from "next/router"
import { useEffect, useState, Fragment, ChangeEvent } from "react"
import { ClientData } from "../types/client"
import styles from "../styles/Status.module.css"

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

export default function Home() {
    const [loading, setLoading] = useState<boolean>(false)
    const [status, setStatus] = useState<ClientData | undefined>()
    const [connected, setConnected] = useState<boolean>(false)
    const [socket, setSocket] = useState<Socket>()
    const [isDark, setDark] = useState<boolean>(true)
    const [searchIndex, setSearch] = useState<string>()
    const { isReady } = useRouter()

    useEffect(() => {
        if (isReady) setLoading(true)
    }, [isReady])

    useEffect(() => {
        setSocket(io("https://pc-stats.eov2.com"))
    }, [])

    useEffect(() => {
        if (!socket) return
        socket
            .on("connect", () => {
                setConnected(true)
            })
            .on("status", (data) => {
                setStatus(data)
            })
            .on("disconnect", () => {
                setConnected(false)
            })
    }, [socket])

    useEffect(() => {
        document
            .querySelector("html")
            ?.setAttribute("data-theme", isDark ? "dark" : "light")
    }, [isDark])

    if (!loading) return <p>Loading...</p>
    if (!connected) return <p>Connecting...</p>

    return (
        <>
            <Head>
                <title>PC Status</title>
                <meta name="description" content="PC Status" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header>
                <div className="navbar bg-base-50">
                    <div className="navbar-start">
                        {`Connected Computers: ${
                            Object.keys(status || {}).length
                        }`}
                    </div>
                    <div className="navbar-center">
                        <a className="btn btn-ghost normal-case text-xl">
                            PC Status
                        </a>
                        <input
                            type="text"
                            placeholder="Search here..."
                            className="input input-bordered input-primary w-64 h-12"
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>
                    <div className="navbar-end">
                        <label className="swap swap-rotate">
                            <input
                                type="checkbox"
                                checked={isDark}
                                onChange={(e) => setDark(e.target.checked)}
                            />

                            <svg
                                className="swap-on fill-current w-5 h-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                            </svg>

                            <svg
                                className="swap-off fill-current w-5 h-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                            </svg>
                        </label>
                    </div>
                </div>
            </header>
            <main
                className={
                    styles.main && "flex items-stretch flex-wrap justify-center"
                }
            >
                {Object.keys(status || {})
                    .filter((pc) =>
                        (status || {})[pc]?.hostname.includes(searchIndex || "")
                    )
                    .sort(
                        (pc, opc) =>
                            Number(Boolean((status || {})[pc]?.gpu)) -
                            Number(Boolean((status || {})[opc]?.gpu))
                    )
                    .map((pc) => (
                        <Fragment key={pc}>
                            <div className="card w-128 bg-base-60 shadow-xl">
                                <div className="card-body">
                                    <div className="avatar center">
                                        <div className="w-12">
                                            <img
                                                src={selectIcon(
                                                    (status || {})[pc]?._os
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <h2 className="card-title">
                                        {(status || {})[pc]?.hostname}
                                    </h2>

                                    <div className="stats shadow">
                                        <div className="stat">
                                            <div className="stat-figure text-secondary"></div>
                                            <div className="stat-title">
                                                CPU
                                            </div>
                                            <div className="stat-value">
                                                {
                                                    (status || {})[pc]?.cpu
                                                        .percent
                                                }
                                                %
                                            </div>
                                            <div className="stat-desc">
                                                <progress
                                                    className="progress progress-info w-20"
                                                    value={
                                                        (status || {})[pc]?.cpu
                                                            .percent
                                                    }
                                                    max="100"
                                                />
                                            </div>
                                        </div>

                                        <div className="stat">
                                            <div className="stat-figure text-secondary"></div>
                                            <div className="stat-title">
                                                RAM
                                            </div>
                                            <div className="stat-value">
                                                {
                                                    (status || {})[pc]?.ram
                                                        .percent
                                                }
                                                %
                                            </div>
                                            <div className="stat-desc">
                                                <progress
                                                    className="progress progress-info w-20"
                                                    value={
                                                        (status || {})[pc]?.ram
                                                            .percent
                                                    }
                                                    max="100"
                                                />
                                            </div>
                                        </div>

                                        <div className="stat">
                                            <div className="stat-figure text-secondary"></div>
                                            <div className="stat-title">
                                                Storage
                                            </div>
                                            <div className="stat-value">
                                                {
                                                    (status || {})[pc]?.storage
                                                        .percent
                                                }
                                                %
                                            </div>
                                            <div className="stat-desc">
                                                <progress
                                                    className="progress progress-info w-20"
                                                    value={
                                                        (status || {})[pc]
                                                            ?.storage.percent
                                                    }
                                                    max="100"
                                                />
                                            </div>
                                        </div>

                                        {(status || {})[pc]?.gpu && (
                                            <div className="stat">
                                                <div className="stat-figure text-secondary"></div>
                                                <div className="stat-title">
                                                    GPU
                                                </div>
                                                <div className="stat-value">
                                                    {
                                                        (status || {})[pc]?.gpu
                                                            .usage
                                                    }
                                                    %
                                                </div>
                                                <div className="stat-desc">
                                                    <progress
                                                        className="progress progress-info w-20"
                                                        value={
                                                            (status || {})[pc]
                                                                ?.gpu.usage
                                                        }
                                                        max="100"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    ))}
            </main>
        </>
    )
}
