import Link from "next/link"
import { SyntheticEvent, useEffect, useRef, useState } from "react"
import Footer from "~/components/Footer"
import Navbar from "~/components/Navabar"
import { api } from "~/utils/api"


const homePage = () => {

    const userData = api.secureActions.userInfo.useQuery()
    const highLight = useRef<HTMLFormElement>(null)
    const highlights = api.secureActions.userHighLights.useQuery()
    const [refresh, setRefresh] = useState<boolean>(false)
    const content = highLight.current?.childNodes[0]?.childNodes[1] as HTMLTextAreaElement
    const url = highLight.current?.childNodes[1]?.childNodes[1] as HTMLInputElement
    const { mutate: addHighLight } = api.secureActions.addPlay.useMutation({
        onSuccess:() => {
            setRefresh(!refresh)
            content.value = ''
            url.value= ''
        }
    })
    const { mutate: like } = api.secureActions.liking.useMutation({
        onSuccess:() => {
            setRefresh(!refresh)
        }
    })
    const { mutate: deleteHighLight } = api.secureActions.deleteHighLight.useMutation({
        onSuccess:() => {
            setRefresh(!refresh)
        }
    })
    useEffect(() => {
        highlights.refetch()
    },[refresh])

const handleAdd = (e: SyntheticEvent) => {
    e.preventDefault()
    addHighLight({ content: content.value, url: url.value })
    
}

    const rev = highlights.data?.highlights.map(e => e).reverse() || []
    return ( 
        <>
            <Navbar/>
            <p>this is user page</p>
            <p>Welcome {userData.data?.name}</p>
           
            <Link href={'/test'} >Login page</Link>
            <div className="border border-black w-1/3 rounded-xl p-1">
                <p className="text-2xl" >New highlight:</p>
                <form ref={highLight} onSubmit={handleAdd} >
                    <label className="p-1 m-1" >Your highlight: 
                        <textarea className=" border border-black width-200" placeholder="Here write your thoughts" required={true}/>
                    </label>
                    <label className="p-1 m-1 ">video url:
                        <input type='text' placeholder="video URL" minLength={10}/>
                    </label>
                    <button className=" border border-black rounded-xl bg-gray-200 hover:bg-white p-1" type="submit" >submit</button>
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
                                    <button type="button" className=" m-1 p-1 border border-black rounded-xl bg-gray-200 hover:bg-black hover:text-white" onClick={() => deleteHighLight({ highlightID: h.id})} >Delete</button>
                                </div>
                            )
                        })
                    }
            <Footer/>
        </>
    )
}

export default homePage