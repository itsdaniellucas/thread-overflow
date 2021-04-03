import React from 'react'
import './Error.css'
import { Link } from 'react-router-dom'

export default function Error(props) {
    const error = props.meta;

    return (
        <div className="errorPage-body">
            <div className="errorPage-center">
                <div className="errorPage-title">
                    <div className="errorPage-errorImage"><img src={error.imageSrc} /></div>
                    <div className="errorPage-errorText">
                        { error.text }
                    </div>
                </div>
                <div className="errorPage-subTitle">
                    { error.subTitle }
                </div>
                <div className="errorPage-content">
                    { error.content }
                </div>
            </div>
            {
                !error.noRedirect ?
                <div className="errorPage-bottom">
                    Redirect to <Link to={error.redirectRoute}>{ error.redirectText || 'Login' } page</Link>
                </div> :
                null
            }
        </div>
    )
}