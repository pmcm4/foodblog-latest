import styles from './not-found.module.scss'

export const NotFound = () => {
    return (
        <div className={styles.pictureContainer}>
            <img className={styles.picture} src='not-found.jpg' alt='not found image'/>
        </div>
        
    )
}