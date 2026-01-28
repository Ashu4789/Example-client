import Student3 from "./Student3";
function StudentList({students}) {
    return(
        <>
        <h1>Student List</h1>
        {students.map((student ,index) => (
            <Student3 
                key = {index} 
                name = {student.name} 
                roll= {student.roll} 
                percentage = {student.percentage}
            />
        ))}
        </>
    );
}
export default StudentList;