import { useEffect, useState } from "react";

export default function Student(){

const [results,setResults] = useState([]);

useEffect(()=>{

fetch("http://localhost:5000/student/1")
.then(res=>res.json())
.then(data=>setResults(data));

},[]);

return(

<div className="container mt-4">

<h2>Student Result</h2>

<table className="table">

<thead>
<tr>
<th>Subject</th>
<th>Marks</th>
<th>Grade</th>
</tr>
</thead>

<tbody>

{results.map((r,i)=>(
<tr key={i}>
<td>{r.SubjectName}</td>
<td>{r.MarksObtained}</td>
<td>{r.Grade}</td>
</tr>
))}

</tbody>

</table>

</div>

);
}