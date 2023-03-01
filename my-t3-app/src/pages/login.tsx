import { SyntheticEvent, useEffect, useRef } from "react"
import { date } from "zod"
import { api, setToken } from "~/utils/api"

const login = () => {
    const input = useRef<HTMLDivElement>(null)
    const { mutate: userLogin } = api.authRouter.login.useMutation({
        onSuccess: ({userToken}) => {
            setToken(userToken)
        } 
    })
    const { mutate: secureAction, data } = api.authRouter.secureActions.useMutation()

    console.log(data)
    

    return (
        <>
            <div ref={input}>
               <input className="border" type='text'/>
               <input className="border" type='password'/>
               <button onClick={() => userLogin({ email: 'somemeail', password: 'somepassword'})} >log in</button>
            </div>
            <div>
                <button type="button" onClick={() => secureAction()} >Secure action</button>
            </div>
        </>
    )
}

export default login