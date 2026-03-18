const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "A4507@a1234",
  database: "StudentResultSystem",
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("MySQL Connected");
});


// ---------------- LOGIN ROUTE ----------------

app.post("/login", (req,res)=>{

const {email} = req.body;

db.query(
"SELECT * FROM Admin WHERE AdminEmail = ?",
[email],
(err,result)=>{

if(err){
res.json(err);
return;
}

if(result.length === 0){
res.json({status:"fail"});
}else{
res.json({status:"success",admin:result[0]});
}

});

});


// ---------------- STUDENT REPORT ----------------

app.get("/student/:id", (req, res) => {

  const id = req.params.id;

  db.query("CALL GetStudentReport(?)",
    [id],
    (err, result) => {

      if(err){
        res.json(err);
        return;
      }

      res.json(result[0]);
    });
});


// ---------------- INSERT RESULT ----------------

app.post("/result", (req, res) => {

  const {marks, grade, studentId, subjectCode, adminId} = req.body;

  console.log("Incoming result:", req.body);

  db.query(
    "CALL AddResult(?,?,?,?,?)",
    [marks, grade, studentId, subjectCode, adminId],
    (err, result) => {

      if(err){
        console.error("Insert error:", err);
        res.json(err);
        return;
      }

      console.log("DB response:", result);

      res.json("Result inserted successfully");
    });

});

app.get("/dashboard", (req, res) => {

  db.query("SELECT * FROM AdminDashboard", (err, result) => {

    if (err) {
      res.json(err);
      return;
    }

    res.json(result);

  });

});

app.get("/students", (req,res)=>{
  db.query("SELECT StudentID, StudentName FROM Student",(err,result)=>{
    if(err) return res.json(err);
    res.json(result);
  });
});

app.get("/subjects", (req,res)=>{
  db.query("SELECT SubjectCode FROM Subject",(err,result)=>{
    if(err) return res.json(err);
    res.json(result);
  });
});


// ---------------- SERVER START ----------------

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

