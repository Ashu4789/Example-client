function EngineeringTeam({ employees }) {
    const engineers = employees.filter(employee => employee.department === "Engineering");

    return (
        <div>
            <h2>Engineering Team</h2>
            <ul>
                {engineers.map(employee => {
                    if (!employee.active) {
                        return null;
                    }
                    return <li key={employee.id}>{employee.name}</li>;
                })}
            </ul>
        </div>
    );
}

export default EngineeringTeam;
