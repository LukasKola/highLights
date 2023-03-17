import Link from "next/link"
import { SyntheticEvent, useEffect, useRef, useState } from "react"
import { api } from "~/utils/api"


const homePage = () => {
    const { mutate: secureAct, data} = api.authRouter.secureActions.useMutation()
    const userData = api.secureActions.userInfo.useQuery()
    const highLight = useRef<HTMLFormElement>(null)
    const highlights = api.secureActions.userHighLights.useQuery()
    const [refresh, setRefresh] = useState<boolean>(false)
    const { mutate: like } = api.secureActions.liking.useMutation({
        onSuccess:() => {
            setRefresh(!refresh)
        }
    })
    
    useEffect(() => {
        highlights.refetch()
    },[refresh])

    const rev = highlights.data?.highlights.map(e => e).reverse() || []
    const likers = rev.map(h => h.likes?.split(','))
    return ( 
        <>
            <p>this is user page</p>
            <p>Welcome {userData.data?.name}</p>
            <button onClick={() => secureAct()} >scure action</button>
        
                { data && <p>secure data: {data.name}</p> }

            <Link href={'/test'} >Login page</Link>
            <div>
                <p>new highlight:</p>
                <form ref={highLight} >
                    <textarea className="width-200"/>
                    <label>video url:
                        <input/>
                    </label>
                </form>
            </div>           
                <h1 className="text-center text-2xl">My high lights</h1>
                    {
                        rev.map(h => { 
                        return (
                            <div key={h.id} className='border border-black flex items-center flex-col '>
                                <p>from: {[h.userName + ' ' + h.createdAt.toDateString() + ' ' + h.createdAt.toLocaleTimeString()]}</p>
                                <p>{h.content}</p>
                                {h.url && <iframe 
                                    src={h.url} width='500' height='300'
                                    title="YouTube video player"  
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                 ></iframe>}
                                <p 
                                    id="like" 
                                    onClick={(e:SyntheticEvent) => like({ highlight: h.id, action: `${e.currentTarget.id}`})} 
                                    title={h.likes || 'nobody like this' } 
                                    className="text-gray-900 hover:text-blue-500 hover:cursor-pointer"
                                    >
                                    likes: {h.likes?.split(',').length! - 1 || 0 }
                                </p>
                                <p 
                                    id='dislike' 
                                    onClick={(e:SyntheticEvent) => like({ highlight: h.id, action: `${e.currentTarget.id}`})} 
                                    title={ h.dislikes || 'nobody dislike this' } 
                                    className="text-gray-900 hover:text-red-500 hover:cursor-pointer"
                                    >
                                    dislikes: {h.dislikes?.split(',').length! - 1 || 0 }
                                </p>
                            </div>
                        )
                        })
                    }
        </>
    )
}

export default homePage