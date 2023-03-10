import Link from "next/link"
import { api } from "~/utils/api"

const test = () => {
    const { mutate: secureAction, data} = api.secureActions.addPlay.useMutation()

    return( 
        <>  <button onClick={() => secureAction()} >Another secure action</button>
            <Link href='/login'>Login page</Link>
            { data && <p>{data.play.name}</p>}
        </>
    )
}

export default test