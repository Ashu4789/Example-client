import Student3 from "./Student3";
function StudentList1({students}) {
    const filteredStudents = students.filter(student => student.percentage > 33.0);
    return(
        <>
        <h1>Passed Student List</h1>
        {filteredStudents.map((student ,index) => (
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
export default StudentList1;