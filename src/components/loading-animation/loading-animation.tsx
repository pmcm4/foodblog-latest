import styles from './loading-animation.module.scss';

export const LoadingAnimation = () => {
    return (
        <>
            <h1 className={styles.h1}>Cooking in progress..</h1>
            <div className={styles.cooking}>
                <div className={styles.bubble}></div>
                <div className={styles.bubble}></div>
                <div className={styles.bubble}></div>
                <div className={styles.bubble}></div>
                <div className={styles.bubble}></div>
                <div className={styles.area}>
                    <div className={styles.sides}>
                        <div className={styles.pan}></div>
                        <div className={styles.handle}></div>
                    </div>
                    <div className={styles.pancake}>
                        <div className={styles.pastry}></div>
                    </div>
                </div>
            </div></>
    )
}