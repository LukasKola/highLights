import Link from "next/link"
import { SyntheticEvent, useRef, useState } from "react"
import { api } from "~/utils/api"

const registration = () => {
    const [message, setMessage] = useState<string>()
    const form = useRef<HTMLFormElement>(null)
    const [loginButton, setLoginButton] = useState<boolean>(false)
    const { mutate: registration} = api.authRouter.registration.useMutation({
        onSuccess: ({newcomer}) => {
            setMessage('succesfully registered')
            console.log(newcomer)
            setLoginButton(true)
        },
        onError: ({message}) => {
            if(message.includes('Unique')){
                setMessage('This email is already registered')
                console.log(message)
            }
        }
    })

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault()
        const name = form.current?.childNodes[0] as HTMLInputElement
        const email = form.current?.childNodes[1] as HTMLInputElement
        const password = form.current?.childNodes[2] as HTMLInputElement
        const confirmPassword = form.current?.childNodes[3] as HTMLInputElement
        if(password.value === confirmPassword.value) registration({ name: name.value ,email: email.value, password: password.value })
        setMessage('passwords dont match')
    }

    return (
        <>
            <div className="flex justify-center ">
                <form className="border border-black rounded m-2 text-center flex flex-col w-1/4 " ref={form} onSubmit={(e) => handleSubmit(e)} >
                    <input className="bg-gray-500 text-white" typeof="text" placeholder="name" required={true} minLength={2} />
                    <input className="bg-gray-500 text-white" type='email' placeholder="email" minLength={4} required={true} />
                    <input className="bg-gray-500 text-white" type='password' placeholder="password" minLength={5} required={true} />
                    <input className="bg-gray-500 text-white" type='password' placeholder="confirm password" minLength={5} required={true} />
                    <button type="submit" >submit</button>
                </form>
                { message && <p>{message}</p> }
                { loginButton && <Link href='/login'>Log in</Link> }

            </div>
        </>
    )
}

export default registration