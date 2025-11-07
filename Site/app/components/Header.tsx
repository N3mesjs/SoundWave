type HeaderProps = {
    userData: {
        id: string,
        username: string
    }
}

export default function Header({userData}: HeaderProps){
    return(<>
        {`Hello ${userData.username}!`}
    </>)
}