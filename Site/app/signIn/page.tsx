export default function SignIn() {
    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h1 className="title">SoundWave</h1>
                    <img src="/logo.png" alt="SoundWave Logo" width={50} height={50}/>
                </div>
                <h3>Sign In to Your Account</h3>
                <hr />
                <form action="/signin" method="POST">
                    <label htmlFor="username">Username:</label><br />
                    <input className="input-fields" type="text" id="username" name="username" required />
                    <br />
                    <label htmlFor="password">Password:</label><br />
                    <input className="input-fields" type="password" id="password" name="password" required />
                </form>
            </div>
        </>
    );
}