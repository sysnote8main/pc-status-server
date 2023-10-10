export default function usageBarColor(percent: Number): string {
    if (percent > 90) return "error"
    if (percent > 75) return "warning"
    return "info"
}
