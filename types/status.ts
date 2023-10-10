interface CPUData {
    cpu: number
}
interface CPU {
    model: string
    cpus: CPUData[]
}

interface RAM {
    free: number
    total: number
}

interface Swap {
    free: number
    total: number
}

interface Storage {
    name?: string
    free: number
    total: number
}

interface GPUMemory {
    free: number
    total: number
}
interface GPU {
    name: string
    usage: number
    memory: GPUMemory
}

export interface StatusData {
    _os: string
    hostname: string
    version: string
    cpu: CPU
    ram: RAM
    swap: Swap
    storage: Storage
    storages?: Storage[]
    uptime: number
    loadavg: number[]
    gpu: GPU
}
