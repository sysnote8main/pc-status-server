interface CPUData {
    cpu: number
}
interface CPU {
    model: string
    cpus: CPUData[]
    percent: number
}

interface RAM {
    free: number
    total: number
    percent: number
}

interface Storage {
    free: number
    total: number
    percent: number
}

interface GPUMemory {
    free: number
    total: number
    percent: number
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
    storage: Storage
    uptime: number
    loadavg: number[]
    gpu: GPU
}
