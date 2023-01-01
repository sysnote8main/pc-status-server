import { ReactNode } from "react"
import styles from "../styles/Loading.module.css"

type Props = {
    children?: ReactNode
    type?: string
}

const LoadingScreen = ({ children, type }: Props) => {
    if (type === "loading") {
        return (
            <div className={styles.loading}>
                <ul className="steps">
                    <li className="step step-primary">Loading</li>
                    <li className="step">Connecting</li>
                </ul>
            </div>
        )
    }

    if (type === "connecting") {
        return (
            <div className={styles.loading}>
                <ul className="steps">
                    <li className="step step-primary">Loading</li>
                    <li className="step step-primary">Connecting</li>
                </ul>
            </div>
        )
    }

    return <></>
}

export default LoadingScreen
