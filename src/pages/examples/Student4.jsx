import { useState } from "react";

function Student4() {
    const [isVisible, setIsVisible] = useState(true);
    const studentlist = [
        {roll: 1, name: "Ashutosh"},
        {roll: 2, name: "Rahul"},
        {roll: 3, name: "Ravi"},
        {roll: 4, name: "Rohit"},
    ];
    const handleClick = () => {
        setIsVisible(!isVisible);
    };
    return (
        <div>
            <button onClick={handleClick}>{isVisible ? "Hide List" : "Show List"}</button>
            {isVisible && (
                <ul>
                    {studentlist.map(student => (
                        <p key={student.roll}>{student.roll} : {student.name}</p>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Student4