function Student3({name, roll, percentage}) {
    return (
        <>
            {percentage > 33.0 && (
                <p>
                    Student Name: {name}
                    <br/>
                    Roll Number: {roll}
                    <br/>
                    Percentage: {percentage}
                    <br/>
                    Result : Pass
                    <br/>
                    congratulations!!!
                </p>
            )}

            {percentage <= 33.0 && (
                <p>
                    Student Name: {name}
                    <br/>
                    Roll Number: {roll}
                    <br/>
                    Percentage: {percentage}
                    <br/>
                    Result : Fail
                    <br/>
                    better luck next time!!!
                </p>
            )}
        </>
    )
}
export default Student3;