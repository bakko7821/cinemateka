import '../styles/NotFoundPage.css'
import { Link } from 'react-router-dom'
export const NotFoundPage = () => {
    return (
        <div className="page flex-column flex-center g16">
            <img src="../../public/images/AnimatedSticker-ezgif.com-gif-maker.gif" alt="" />
            <p className='errorText'>404 page</p>
            <p className='descriptionText'>Извините, вы попапали на несуществующую станицу <Link to="/">Вернуться на главную.</Link></p>
        </div>
    )
}