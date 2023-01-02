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
                    <progress
                        className="progress progress-info w-0 hidden"
                        value="50"
                        max="100"
                    ></progress>
                    <progress
                        className="progress progress-warning w-0 hidden"
                        value="50"
                        max="100"
                    ></progress>
                    <progress
                        className="progress progress-error w-0 hidden"
                        value="50"
                        max="100"
                    ></progress>
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
