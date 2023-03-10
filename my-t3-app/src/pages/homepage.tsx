import Link from "next/link"
import { api } from "~/utils/api"


const homePage = () => {
    const { mutate: secureAct, data} = api.authRouter.secureActions.useMutation()
    const userData = api.secureActions.userInfo.useQuery()

    return ( 
        <>
            <p>this is user page</p>
            <p>Welcome {userData.data?.name}</p>
            <button onClick={() => secureAct()} >scure action</button>
        
                { data && <p>secure data: {data.name}</p> }

            <Link href={'/login'} >Login page</Link>
        </>
    )
}

export default homePage