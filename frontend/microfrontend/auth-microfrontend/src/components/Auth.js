import React, {useEffect} from 'react';
import * as auth from "../utils/auth.js";
import InfoTooltip from './InfoTooltip.js';

function Auth() {

    // при монтировании Auth описан эффект, проверяющий наличие токена и его валидности
    React.useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) {
        auth
            .checkToken(token)
            .then((res) => {
                dispatchEvent(new CustomEvent("user-data", {
                    detail: res.data,
                }));
            })
            .catch((err) => {
                localStorage.removeItem("jwt");
                console.log(err);
            });
        }
    }, []);

    return (
        <InfoTooltip />
    );
}

export default Auth;
