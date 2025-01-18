import Head from "next/head"
import io, { Socket } from "socket.io-client"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { ClientData } from "../types/client"
import styles from "../styles/Status.module.css"
import LoadingScreen from "../components/loadingScreen"
import Status from "../components/status"
import Focus from "../components/focus"

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
        setSocket(io("https://pcss.eov2.com"))
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
            .on("toast", (data) => {
                switch (true) {
                    case /disconnected/.test(data.message):
                        toast.custom(
                            (t) => {
                                return (
                                    <div className="bg-transparent backdrop-blur-sm shadow-lg text-error p-3 rounded-box">
                                        <div>
                                            <p>{data.message}</p>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                duration: data.duration,
                            },
                        )
                        break

                    case /connected/.test(data.message):
                        toast.custom(
                            (t) => {
                                return (
                                    <div className="bg-transparent backdrop-blur-sm shadow-lg text-info p-3 rounded-box">
                                        <div>
                                            <p>{data.message}</p>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                duration: data.duration,
                            },
                        )
                        break
                    default:
                        break
                }
            })
            .on("disconnect", () => {
                setConnected(false)
                setStatus({})
            })
    }, [socket])

    useEffect(() => {
        document
            .querySelector("html")
            ?.setAttribute("data-theme", isDark ? "dark" : "light")
    }, [isDark])

    if (!loading) return <LoadingScreen type="loading" />
    if (!connected) return <LoadingScreen type="connecting" />

    return (
        <>
            <Head>
                <title>PC Status</title>
                <meta name="description" content="PC Status" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=0.5,minimum-scale=0.5"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div>
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                    containerStyle={{
                        top: 80,
                    }}
                />
            </div>

            <header className="sticky top-0 z-50">
                <div className="navbar bg-base-50 backdrop-blur-sm shadow-lg">
                    <div className="navbar-start">
                        <div className="dropdown dropdown-hover">
                            <label
                                tabIndex={0}
                                className="btn btn-ghost btn-circle"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h7"
                                    />
                                </svg>
                            </label>
                            <ul
                                tabIndex={0}
                                className="overflow-auto dropdown-content menu menu-compact p-1 shadow bg-base-100 rounded-box w-52"
                            >
                                <li>
                                    <a href="">none</a>
                                </li>
                                {Object.keys(status || {})
                                    .filter((pc) =>
                                        (status || {})[pc]?.hostname.includes(
                                            searchIndex || "",
                                        ),
                                    )
                                    .sort(
                                        (pc, opc) =>
                                            Number(
                                                Boolean(
                                                    (status || {})[pc]?.gpu,
                                                ),
                                            ) -
                                            Number(
                                                Boolean(
                                                    (status || {})[opc]?.gpu,
                                                ),
                                            ),
                                    )
                                    .map((pc) => (
                                        <li key={pc}>
                                            {
                                                <a
                                                    href={
                                                        "/#" +
                                                        (status || {})[pc]
                                                            ?.hostname
                                                    }
                                                >
                                                    {
                                                        (status || {})[pc]
                                                            ?.hostname
                                                    }
                                                </a>
                                            }
                                        </li>
                                    ))}
                            </ul>
                        </div>
                        {`PC: ${Object.keys(status || {}).length}`}
                    </div>
                    <div className="navbar-center">
                        <div className="dropdown dropdown-hover">
                            <p
                                tabIndex={0}
                                className="p-4 bg-base-50 bg-transparent backdrop-blur-sm"
                            >
                                PC Status
                            </p>
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu menu-compact p-1 shadow bg-base-100 rounded-box w-52"
                            >
                                <li>
                                    <label htmlFor="about-modal">About</label>
                                </li>
                            </ul>
                        </div>
                        <input
                            type="text"
                            placeholder="Search here..."
                            className="input input-bordered input-primary bg-transparent backdrop-blur-sm w-64 h-12"
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>
                    <div className="navbar-end">
                        <label className="swap swap-rotate">
                            <input
                                type="checkbox"
                                checked={isDark}
                                onChange={(e) => setDark(e.target.checked)}
                            />{" "}
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
            <main className={styles.main}>
                <ul className={styles.masonry}>
                    {Object.keys(status || {})
                        .filter((pc) =>
                            (status || {})[pc]?.hostname.includes(
                                searchIndex || "",
                            ),
                        )
                        .sort(
                            (pc, opc) =>
                                Number(Boolean((status || {})[pc]?.gpu)) -
                                Number(Boolean((status || {})[opc]?.gpu)),
                        )
                        .map((pc) => (
                            <li key={pc}>
                                <Status status={status || {}} pc={pc} />
                            </li>
                        ))}
                </ul>
            </main>

            <input type="checkbox" id="about-modal" className="modal-toggle" />
            <div className="modal backdrop-blur-sm z-50">
                <div className="modal-box">
                    <div className="modal-action">
                        <label className="bg-transparent border-none absolute left-5 top-3">
                            About
                        </label>
                        <label
                            htmlFor="about-modal"
                            className="btn btn-sm btn-circle border-none absolute right-2 top-2 bg-base-50 bg-transparent"
                        >
                            ✕
                        </label>
                    </div>
                    <div>
                        <p>
                            PC Status is a site created by{" "}
                            <a
                                href="https://csys64.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link"
                            >
                                csys64
                            </a>
                        </p>

                        <p>
                            Repository:{" "}
                            <a
                                href="https://github.com/eoeo-org/pcsc-rs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link"
                            >
                                Client
                            </a>{" "}
                            <a
                                href="https://github.com/Zel9278/pc-status-server"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link"
                            >
                                Frontend
                            </a>{" "}
                            <a
                                href="https://github.com/Zel9278/pc-status-server-backend"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link"
                            >
                                Backend
                            </a>
                        </p>
                        <p>
                            CSS:{" "}
                            <a
                                href="https://tailwindcss.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link"
                            >
                                TailwindCSS
                            </a>{" "}
                            <a
                                href="https://daisyui.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link"
                            >
                                daisyUI
                            </a>
                        </p>

                        <br />

                        <p>
                            Rendered With{" "}
                            <a
                                href="https://nextjs.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link"
                            >
                                Next.js
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {Object.keys(status || {})
                .filter((pc) =>
                    (status || {})[pc]?.hostname.includes(searchIndex || ""),
                )
                .sort(
                    (pc, opc) =>
                        Number(Boolean((status || {})[pc]?.gpu)) -
                        Number(Boolean((status || {})[opc]?.gpu)),
                )
                .map((pc) => (
                    <Focus status={status || {}} pc={pc} key={pc} />
                ))}
        </>
    )
}
