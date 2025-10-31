"use client";

const handleSubmit = async () => {
    const response = await fetch('/api/singin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    console.log(data);
}

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
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label><br />
                    <input className="input-fields" type="text" id="username" name="username" required />
                    <br />
                    <label htmlFor="password">Password:</label><br />
                    <input className="input-fields" type="password" id="password" name="password" required />
                    <br />
                    <button className="submit-button" type="submit">Sign In</button>
                </form>
            </div>
        </>
    );
}