import Student from "./pages/examples/Student";
import Student1 from "./pages/examples/Student1";
import Student2 from "./pages/examples/Student2";
import Student3 from "./pages/examples/Student3";
import StudentList from "./pages/examples/StudentList";
import StudentList1 from "./pages/examples/StudentList1";
import UserCard from "./pages/practice/UserCard";
import ProductList from "./pages/practice/ProductList";
import EngineeringTeam from "./pages/practice/EngineeringTeam";


const students = [
  { name: "Ashutosh", roll: "19", percentage: 99.9 },
  { name: "Jagan", roll: "54", percentage: 32.8 },
  { name: "Abhisek", roll: "17", percentage: 88.9 },
]
const products = [
  { id: 1, name: "Laptop", price: 999, category: "Electronics" },
  { id: 2, name: "Coffee Maker", price: 49, category: "Home Appliance" },
  { id: 3, name: "Smart Phone", price: 699, category: "Electronics" },
]

const employees = [
  { id: 101, name: "Alice", department: "Engineering", active: true },
  { id: 102, name: "Bob", department: "Design", active: false },
  { id: 103, name: "Charlie", department: "Engineering", active: true },
  { id: 104, name: "David", department: "HR", active: true }
];

function App() {


  return (
    <>
      <h1>hello world</h1>
      <Student />
      <Student1 name="Jagan" roll="54" />
      <Student2 name="Abhisek" roll="17" />
      <Student3 name="Ashutosh" roll="19" percentage={99.9} />
      <Student3 name="Jagan" roll="54" percentage={32.8} />
      <StudentList students={students} />
      <StudentList1 students={students} />
      <UserCard name="Ashutosh" age="21" location="Bhubaneswar" isPremium={true} />
      <UserCard name="Jagan" age="22" location="Cuttack" isPremium={false} />
      <UserCard name="Abhisek" age="23" location="Patna" isPremium={true} />
      <ProductList products={products} />
      <EngineeringTeam employees={employees} />
    </>
  )
};

export default App;
