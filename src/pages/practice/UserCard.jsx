function UserCard({ name, age, location, isPremium }) {
    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', margin: '10px' }}>
            <h1>{name}</h1>
            <p>Age: {age}</p>
            <p>Location: {location}</p>
            <p>{isPremium ? "VIP member" : "standard member"}</p>
        </div>
    );
}

export default UserCard;