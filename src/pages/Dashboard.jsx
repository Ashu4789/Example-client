function Dashboard({userDetails}) {
    return (
        <div>
            <h1>Welcome to the Dashboard</h1>
                <div>
                    <h1>Welcome, {userDetails.name}!</h1>
                    <h2>User Details:</h2>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <p><strong>User ID:</strong> {userDetails._id}</p>
                </div>
        </div>
    )
};
export default Dashboard;