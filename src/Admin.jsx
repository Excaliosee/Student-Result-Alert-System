import { useEffect, useState } from "react";

export default function Admin(){

const [data,setData] = useState([]);

const [marks,setMarks] = useState("");
const [grade,setGrade] = useState("");
const [studentId,setStudentId] = useState("");
const [subjectCode,setSubjectCode] = useState("");


// function to load dashboard data
const loadDashboard = () => {
 fetch("http://localhost:5000/dashboard")
 .then(res=>res.json())
 .then(data=>setData(data))
 .catch(err=>console.error(err));
};


// load data when page opens
useEffect(()=>{
 loadDashboard();
},[]);


// upload result
const addResult = ()=>{

fetch("http://localhost:5000/result",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
marks,
grade,
studentId,
subjectCode,
adminId:1
})

})
.then(res=>res.json())   // IMPORTANT
.then(data=>{

alert("Result inserted successfully");

// reload dashboard after insert
loadDashboard();

// clear input fields
setMarks("");
setGrade("");
setStudentId("");
setSubjectCode("");

})
.catch(err=>{
console.error(err);
alert("Error inserting result");
});

};


return(

<div className="container mt-4">

<h2>Admin Dashboard</h2>


<h4 className="mt-4">Upload Result</h4>

<input
className="form-control mb-2"
placeholder="Student ID"
value={studentId}
onChange={(e)=>setStudentId(e.target.value)}
/>

<input
className="form-control mb-2"
placeholder="Subject Code (DBMS, AI etc)"
value={subjectCode}
onChange={(e)=>setSubjectCode(e.target.value)}
/>

<input
className="form-control mb-2"
placeholder="Marks"
value={marks}
onChange={(e)=>setMarks(e.target.value)}
/>

<input
className="form-control mb-3"
placeholder="Grade"
value={grade}
onChange={(e)=>setGrade(e.target.value)}
/>

<button
className="btn btn-success mb-4"
onClick={addResult}
>
Upload Result
</button>


<h4>Notification / Result Status</h4>

<table className="table">

<thead>
<tr>
<th>Student</th>
<th>Subject</th>
<th>Marks</th>
<th>Grade</th>
<th>Alert Status</th>
</tr>
</thead>

<tbody>

{data.map((row,i)=>(
<tr key={i}>
<td>{row.StudentName}</td>
<td>{row.SubjectName}</td>
<td>{row.MarksObtained}</td>
<td>{row.Grade}</td>
<td>{row.AlertStatus}</td>
</tr>
))}

</tbody>

</table>

</div>

);
}



