import Image from 'next/image';

type HeaderProps = {
    userData: {
        id: string,
        username: string,
        avatar: string
    }
}

export default function Header({userData}: HeaderProps){
    return(
        <div className="header">
            <div className="logo">
                <div className='image-container'>
                    <Image src="/logo.png" alt="logo" fill/>
                </div>
                <h1>SoundWave</h1>
            </div>
            <div>

            </div>
        </div>
    )
}