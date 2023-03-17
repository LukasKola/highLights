import Link from "next/link"
import { api } from "~/utils/api"

const test = () => {
    const { mutate: secureAction, data} = api.secureActions.addPlay.useMutation()
    console.log(data)
    return( 
        <>  <button onClick={() => secureAction({ content: 'something', url: "https://www.youtube.com/embed/vdpNdx4ypUg"})} >Another secure action</button>
            <Link href='/login'>Login page</Link>
        </>
    )
}

export default test