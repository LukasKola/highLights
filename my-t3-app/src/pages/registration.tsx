import { SyntheticEvent, useRef, useState } from "react"
import { api } from "~/utils/api"

const registration = () => {
    const [message, setMessage] = useState<string>()
    const form = useRef<HTMLFormElement>(null)
    const { mutate: registration} = api.authRouter.registration.useMutation({
        onSuccess: ({newcomer}) => {
            setMessage('succesfully registered')
            console.log(newcomer)
        }
    })

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault()
        const email = form.current?.childNodes[0] as HTMLInputElement
        const password = form.current?.childNodes[1] as HTMLInputElement
        registration({ email: email.value, password: password.value })
    }

    return (
        <>
            <form ref={form} onSubmit={(e) => handleSubmit(e)} >
                <input typeof="text" placeholder="name"/>
                <input type='email' placeholder="email"/>
                <input type='password' placeholder="password"/>
                <input type='password' placeholder="confirm password" />
                <button type="submit" >submit</button>
            </form>
            { message && <p>{message}</p>}
        </>
    )
}

export default registration