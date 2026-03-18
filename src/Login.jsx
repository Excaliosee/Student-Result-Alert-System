import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login(){

const navigate = useNavigate();
const [role,setRole] = useState("Admin");
const [email,setEmail] = useState("");

const login = () => {

if(role === "Admin"){

fetch("http://localhost:5000/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({email})
})
.then(res=>res.json())
.then(data=>{

if(data.status==="success"){
navigate("/admin");
}else{
alert("Invalid admin email");
}

});

}

if(role === "Faculty"){
navigate("/faculty");
}

if(role === "Student"){
navigate("/student");
}

};

return(

<div className="container col-4 mt-5">

<h3 className="mb-4">Student Result Alert System</h3>

<input
className="form-control mb-3"
placeholder="Email (only required for Admin)"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<select
className="form-control mb-3"
value={role}
onChange={(e)=>setRole(e.target.value)}
>
<option>Admin</option>
<option>Faculty</option>
<option>Student</option>
</select>

<button
className="btn btn-primary w-100"
onClick={login}
>
Login
</button>

</div>

);
}