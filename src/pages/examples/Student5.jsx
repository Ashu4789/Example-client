import { useState } from "react";
function Student5() {
    const [isVisible, setIsVisible] = useState(true);
    const [buttonText, setButtonText] = useState("Show list");
    const studentlist = [
        {roll: 1, name: "Ashutosh"},
        {roll: 2, name: "Rahul"},
        {roll: 3, name: "Ravi"},
        {roll: 4, name: "Rohit"},
    ];
    const handleClick = () => {
        setIsVisible(!isVisible);
        setButtonText(isVisible ? "Show list" : "Hide list");
    };

    return (
        <>
            <h1>Student5</h1>
            <button onClick={handleClick}>{buttonText}</button>
            {isVisible && (
                <ul>
                    {studentlist.map(student => (
                        <li key={student.roll}>{student.roll} : {student.name}</li>
                    ))}
                </ul>
            )}
        </>
    )
}

export default Student5;