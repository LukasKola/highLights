import Image from "next/image"

const Navbar = () => {

    const logOut = () => {
        window.location.href = '/'
    }

    return(
        <>
            <nav className="w-full fixed px-2 sm:px-4 py-2.5 z-20 top-0 left-0 bg-gray-500 h-12">
                <div className="flex justify-end">
                    <Image src={'/user.png'} alt={'/user.png'} width={'30'} height={'30'} />
                    <button onClick={logOut} className="hover:text-white">Log out</button>
                </div>
            </nav>
        </>
    )
}

export default Navbar