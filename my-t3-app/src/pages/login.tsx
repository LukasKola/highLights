import Link from "next/link"
import { SyntheticEvent, useRef, useState } from "react"
import { api, setToken } from "~/utils/api"
import { useRouter } from "next/router"


const login = () => {

    const router = useRouter()
    const input = useRef<HTMLFormElement>(null)
    const [ message, setMessage] = useState<string>()
    const { mutate: userLogin } = api.authRouter.login.useMutation({
        onSuccess: ({userToken}) => {  
                setToken(userToken!)
                router.push('/homepage')
    },
        onError: ( { message }) => {
            setMessage(message)
        }
    })
    const { mutate: secureAction, data } = api.authRouter.secureActions.useMutation()
    const password = input.current
    console.log(password)
    
    
    const handleSub = (e: SyntheticEvent) => {
        e.preventDefault()
        if(input.current){
            const email = input.current?.childNodes[0] as HTMLInputElement
            const password = input.current.childNodes[1] as HTMLInputElement
            console.log('inputone:', email.value,)
            userLogin({email: email.value, password: password.value})
        }
    }

    

    return (
        <>
            <form  ref={input} onSubmit={(e) => handleSub(e)}>
               <input className="border" type='text' placeholder="email"  />
               <input className="border" type='password' placeholder="password" />
               <button type="submit" >log in</button>
            </form>
            <div>
                { 
                    message && <p>{message}</p>
                }
            </div>
            <div>
                <button type="button" onClick={() => secureAction()} >Secure action</button>
                {
                    data && <p>secure data: {data.name}</p>
                }
            </div>
            <Link href='/test'>some page</Link>
        </>
    )
}

export default login