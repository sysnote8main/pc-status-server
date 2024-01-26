import { Fragment, ReactNode, useEffect, useState } from "react"
import { ClientData } from "../types/client"
import usageBarColor from "../Utils/usageBarColor"
import { byteToData } from "../Utils/byteToData"
import progressStyle from "../styles/Progress.module.css"
import selectIcon from "../Utils/selectIcon"
import { getCPUPercent, getPercent } from "../Utils/getPercent"
import Progressbar from "./ProgressBar"

type Props = {
    children?: ReactNode
    status: ClientData
    pc: string
}

const Focus = ({ children, status, pc }: Props) => {
    const pcStatus = (status || {})[pc]
    const cpuPercent = getCPUPercent(pcStatus.cpu.cpus)
    const ramPercent = getPercent(pcStatus.ram.free, pcStatus.ram.total)
    let swapPercent = 0
    if (pcStatus.swap)
        swapPercent = getPercent(pcStatus.swap.free, pcStatus.swap.total)
    const storages = Array.isArray(pcStatus.storages)
        ? pcStatus.storages
        : [pcStatus.storage]
    let gpuMemPercent = 0
    if (pcStatus.gpu)
        gpuMemPercent = getPercent(
            pcStatus.gpu.memory.free,
            pcStatus.gpu.memory.total
        )

    return (
        <Fragment>
            <input
                type="checkbox"
                id={`focus-${pcStatus?.hostname}-modal`}
                className="modal-toggle"
            />
            <div className="modal z-50">
                <div className="modal-box p-0">
                    <div
                        id={`${pcStatus?.hostname}-modal-title`}
                        className="flex justify-between sticky backdrop-blur-sm shadow-lg py-2 px-5 top-0 z-50"
                    >
                        <label className="bg-transparent border-none">
                            Focus - {pcStatus?.hostname}
                        </label>
                        <label
                            htmlFor={`focus-${pcStatus?.hostname}-modal`}
                            className="btn btn-sm btn-circle border-none w-8 bg-base-50 bg-transparent"
                        >
                            ✕
                        </label>
                    </div>
                    <div className="statusBody px-6 py-3">
                        <div className="flex items-center">
                            <div className="avatar center">
                                <div className="w-12">
                                    <img src={selectIcon(pcStatus?._os)} />
                                </div>
                            </div>
                            <p className="px-2">{pcStatus._os}</p>
                        </div>

                        <div className="bg-slate-700 w-full h-0.5 rounded my-2" />
                        <p>CPU: {pcStatus?.cpu.model}</p>
                        <div className="flex items-center">
                            <p>All:</p>
                            <Progressbar
                                value={cpuPercent}
                                className="w-full mx-3"
                            />
                            <p>{Math.floor(cpuPercent)}%</p>
                        </div>
                        <ul>
                            {pcStatus?.cpu.cpus.map((cpu, i) => {
                                return (
                                    <li key={i} className="flex items-center">
                                        <p>Core{i}:</p>
                                        <Progressbar
                                            value={cpu.cpu}
                                            className="w-full mx-3"
                                        />
                                        <p>{Math.floor(cpu.cpu)}%</p>
                                    </li>
                                )
                            })}
                        </ul>
                        <div className="bg-slate-700 w-full h-0.5 rounded my-2" />
                        <p>
                            RAM:{" "}
                            {byteToData(
                                pcStatus?.ram.total - pcStatus?.ram.free
                            )}
                            /{byteToData(pcStatus?.ram.total)} |{" "}
                            {byteToData(pcStatus?.ram.free)} free
                        </p>
                        <div className="flex items-center">
                            <p>RAM:</p>
                            <Progressbar
                                value={ramPercent}
                                className="w-full mx-3"
                            />
                            <p>{Math.floor(ramPercent)}%</p>
                        </div>
                        {pcStatus?.swap && (
                            <>
                                <div className="bg-slate-700 w-full h-0.5 rounded my-2" />
                                Swap:{" "}
                                {byteToData(
                                    pcStatus?.swap.total - pcStatus?.swap.free
                                )}
                                /{byteToData(pcStatus?.swap.total)} |{" "}
                                {byteToData(pcStatus?.swap.free)} free
                                <div className="flex items-center">
                                    <p>Swap:</p>
                                    <Progressbar
                                        value={swapPercent}
                                        className="w-full mx-3"
                                    />
                                    <p>{Math.floor(swapPercent)}%</p>
                                </div>
                            </>
                        )}
                        <div className="bg-slate-700 w-full h-0.5 rounded my-2" />
                        <p>Storages</p>
                        <ul>
                            {storages.map((storage, i) => {
                                const storagePercent = getPercent(
                                    storage.free,
                                    storage.total
                                )
                                return (
                                    <li
                                        key={i}
                                        className="border-2 border-slate-600"
                                    >
                                        <p>
                                            {i}:{" "}
                                            {storage.name || "Unknown Name"}
                                        </p>
                                        <div className="flex items-center">
                                            <Progressbar
                                                value={storagePercent}
                                                className="w-full mx-3"
                                            />{" "}
                                            <p>{Math.floor(storagePercent)}%</p>
                                        </div>
                                        <p>
                                            Usage:{" "}
                                            {byteToData(
                                                storage.total - storage.free
                                            )}
                                            /{byteToData(storage.total)} |{" "}
                                            {byteToData(storage.free)} free
                                        </p>
                                    </li>
                                )
                            })}
                        </ul>
                        <div className="bg-slate-700 w-full h-0.5 rounded my-2" />
                        <p>Uptime: {pcStatus.uptime}</p>
                        {pcStatus?.gpu && (
                            <>
                                <div className="bg-slate-700 w-full h-0.5 rounded my-2" />
                                <p>GPU: {pcStatus?.gpu.name}</p>
                                <div className="flex items-center">
                                    <p>GPU:</p>
                                    <Progressbar
                                        value={pcStatus.gpu.usage}
                                        className="w-full mx-3"
                                    />{" "}
                                    <p>{Math.floor(pcStatus.gpu.usage)}%</p>
                                </div>
                                <p>
                                    VRAM:{" "}
                                    {byteToData(
                                        (pcStatus?.gpu.memory.total -
                                            pcStatus?.gpu.memory.free) *
                                            1024 *
                                            1024
                                    )}
                                    /
                                    {byteToData(
                                        pcStatus?.gpu.memory.total * 1024 * 1024
                                    )}{" "}
                                    |{" "}
                                    {byteToData(
                                        pcStatus?.gpu.memory.free * 1024 * 1024
                                    )}{" "}
                                    free
                                </p>
                                <div className="flex items-center">
                                    <p>VRAM:</p>
                                    <Progressbar
                                        value={gpuMemPercent}
                                        className="w-full mx-3"
                                    />{" "}
                                    <p>{Math.floor(gpuMemPercent)}%</p>
                                </div>
                            </>
                        )}
                        {pcStatus.loadavg && (
                            <>
                                <div className="bg-slate-700 w-full h-0.5 rounded my-2" />
                                <p>LoadAverage:</p>
                                <p>1Min: {pcStatus.loadavg[0]}</p>
                                <p>5Min: {pcStatus.loadavg[1]}</p>
                                <p>15Min: {pcStatus.loadavg[2]}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Focus
