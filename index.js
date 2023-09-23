const express = require("express");
const app = express();
const port = process.env.port || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json());
require("dotenv").config();

// console.log(process.env.DB_USER, process.env.DB_PASS);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6u8iq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const run = async () => {
  try {
    const requirementCollection = client
      .db("humanResources")
      .collection("requirements");

      const departmentCollection = client
      .db("humanResources")
      .collection("department");

      const workerRequirementCollection = client
      .db("humanResources")
      .collection("workerRequirements");

      const workerDepartmentCollection = client
      .db("humanResources")
      .collection("workerDepartment");

    const EmployeeCollection = client
      .db("humanResources")
      .collection("employees");

      const workerCollection = client
      .db("humanResources")
      .collection("worker");

    const AnnouncementCollection = client
      .db("humanResources")
      .collection("announcements");

    const AttendenceCollection = client
      .db("humanResources")
      .collection("attendences")      
    const OvertimeCollection = client
      .db("humanResources")
      .collection("overtimes");

      
      const PaymentCollection = client
      .db("humanResources")
      .collection("payment");

    // GET
    app.get("/home", async (req, res) => {
      
      const totalEmployee = await EmployeeCollection.countDocuments();
      const Announcement = await AnnouncementCollection.find({})
        .sort({ date: -1 })
        .toArray();

      const latestAnnouncement = Announcement[0];


      const d = new Date();

      const day = d.getDate();
      const month = d.getMonth();
      const year = d.getFullYear();

      let date;

      if (month === 10 || month === 11) {
        date = `${year}-${month + 1}-${day}`;
      } else {
        date = `${year}-0${month + 1}-${day}`;
      }

      const query = { date: { $eq: date } };
      // const query ={}
      const todaysAttendence = await AttendenceCollection.find(query).toArray();
      const todaysAttendenceCount = todaysAttendence.length
      

      // console.log(month);
      res.send({ totalEmployee,  latestAnnouncement, todaysAttendenceCount });
    });

    //Get All Requirements
     app.get("/requirement", async (req, res) => {
      const query = {};
      const cursor = requirementCollection.find(query);

      const result = await cursor.toArray();
      res.send(result);
    });

    //getDepartment
    app.get("/getDepartment", async (req, res) => {
      const query = {};
      const cursor = departmentCollection.find(query);

      const result = await cursor.toArray();
      res.send(result);
    });

    //Get All worker Requirements
    app.get("/workerRequirement", async (req, res) => {
      const query = {};
      const cursor = workerRequirementCollection.find(query);

      const result = await cursor.toArray();
      res.send(result);
    });

    //workerGetDepartment
    app.get("/workerGetDepartment", async (req, res) => {
      const query = {};
      const cursor = workerDepartmentCollection.find(query);

      const result = await cursor.toArray();
      res.send(result);
    });

    // Get All Employees
    app.get("/employee", async (req, res) => {
      const query = {};
      const cursor = EmployeeCollection.find(query);

      const result = await cursor.toArray();
      res.send(result);
    });

    // Get All Worker
    app.get("/worker", async (req, res) => {
      const query = {};
      const cursor = workerCollection.find(query);

      const result = await cursor.toArray();
      res.send(result);
    });

    // Get announcement
    app.get("/announcement", async (req, res) => {
      const query = {};
      const cursor = AnnouncementCollection.find(query).sort({ date: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    // Attendence
    app.get("/attendence", async (req, res) => {
      const d = new Date();

      const day = d.getDate();
      const month = d.getMonth();
      const year = d.getFullYear();

      let date;

      if (month === 10 || month === 11) {
        date = `${year}-${month + 1}-${day}`;
      } else {
        date = `${year}-0${month + 1}-${day}`;
      }

      // console.log(date);

      const query = { date: { $eq: date } };
      // const query ={}
      const cursor = AttendenceCollection.find(query).sort({ date: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    //attendance
    app.get("/attendance", async (req, res) => {
      const query = {};
      const cursor = AttendenceCollection.find(query);

      const result = await cursor.toArray();
      res.send(result);
    });


     //Over time
     app.get("/overtime", async (req, res) => {
      const query = {};
      const cursor = OvertimeCollection.find(query);

      const result = await cursor.toArray();
      res.send(result);
    });

    //get history by key
    app.get('/getHistory/:key',(req,res)=> {
    
      PaymentCollection.find({id:req.params.key})
      .toArray((err,documents) => {
        res.send(documents)
      })
    })

    // POST

    //Requirements
    app.post("/requirement",async(req,res)=>{
      const requirement = req.body;
      //console.log(requirement);

      const result = await requirementCollection.insertOne(requirement);
      res.send(result);
    })
    //Requirement department
    app.post("/requirementDepartment",async(req,res)=>{
      const department = req.body;
      //console.log(requirement);

      const result = await departmentCollection.insertOne(department);
      res.send(result);
    })

    //workerRequirements
    app.post("/workerRequirement",async(req,res)=>{
      const requirement = req.body;
      //console.log(requirement);

      const result = await workerRequirementCollection.insertOne(requirement);
      res.send(result);
    })
    //Requirement department
    app.post("/workerRequirementDepartment",async(req,res)=>{
      const department = req.body;
      //console.log(requirement);

      const result = await workerDepartmentCollection.insertOne(department);
      res.send(result);
    })

    // Post employee
    app.post("/employee", async (req, res) => {
      const employee = req.body;
      //console.log(employee);
      const result = await EmployeeCollection.insertOne(employee);
      res.send(result);
    });

    //Post Worker
    app.post("/worker", async (req, res) => {
      const worker = req.body;
      //console.log(employee);
      const result = await workerCollection.insertOne(worker);
      res.send(result);
    });

    // Post announcement
    app.post("/announcement", async (req, res) => {
      const announcement = req.body;

      announcement.date = new Date();
      // console.log(announcement);
      const result = await AnnouncementCollection.insertOne(announcement);
      res.send(result);
    });

    // Attendence

    app.post("/attendance", async (req, res) => {
      const attendance = req.body;

      // console.log(announcement);
      const result = await AttendenceCollection.insertOne(attendance);
      res.send(result);
    });

    // over time
    app.post("/overtime", async (req, res) => {
      const overtime = req.body;

      // console.log(announcement);
      const result = await OvertimeCollection.insertOne(overtime);
      res.send(result);
    });


     // payment
     app.post("/payment", async (req, res) => {
      const payment = req.body;

      // console.log(announcement);
      const result = await PaymentCollection.insertOne(payment);
      res.send(result);
    });


     //delete employee
    app.delete("/employee/:id",async(req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await EmployeeCollection.deleteOne(query);
      res.send(result);
    })


      //delete worker
      app.delete("/worker/:id",async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await workerCollection.deleteOne(query);
        res.send(result);
      })


    // Delete
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
    app.delete("/announcement/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await AnnouncementCollection.deleteOne(query);
      res.send(result);
    });

    //delete attendance
    app.delete("/attendance/:id",async(req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await AttendenceCollection.deleteOne(query);
      res.send(result);
    })

    //delete OverTime
    app.delete("/overtime/:id",async(req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await OvertimeCollection.deleteOne(query);
      res.send(result);
    })

    //Delete Designation
     app.delete("/deleteDesignation/:id",async(req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await requirementCollection.deleteOne(query);
      res.send(result);
    })

    //Delete role
    app.delete("/deleteRole/:id",async(req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await requirementCollection.deleteOne(query);
      res.send(result);
    })

    //Delete Department
    app.delete("/deleteDepartment/:id",async(req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await departmentCollection.deleteOne(query);
      res.send(result);
    })


    app.delete("/deleteDepartmentRequirement/:id",async(req,res)=>{
      const id = req.params.id;
      const query = {department:id};
      const result = await requirementCollection.deleteOne(query);
      res.send(result);
    })



    //Update Employee
    app.patch('/updateEmployee/:id',(req,res)=>{
      const employee = req.body;
      const {fullName,designation,contactNumber,gender,role} = employee;
      EmployeeCollection.updateOne(
        {_id:ObjectId(req.params.id)}, 
        {$set:{
                fullName:fullName,
                designation:designation,
                contactNumber:contactNumber,
                gender:gender,
                role:role
        }}
      )
      .then(result=>{
        res.send(result.acknowledged)
      })
    })

     //Update worker
     app.patch('/UpdateWorker/:id',(req,res)=>{
      const employee = req.body;
      const {fullName,designation,contactNumber,gender,role} = employee;
      workerCollection.updateOne(
        {_id:ObjectId(req.params.id)},
        {$set:{
                fullName:fullName,
                designation:designation,
                contactNumber:contactNumber,
                gender:gender,
                role:role
        }}
      )
      .then(result=>{
        res.send(result.acknowledged)
      })
    })

    //Update Employee from paymentList
    app.patch('/updateEmployeeData/:id',(req,res)=>{
      const employeeData = req.body;
      const {status,netSalary,dues} = employeeData;
      EmployeeCollection.updateOne(
        {_id:ObjectId(req.params.id)},
        {$set:{
                status:status,
                netSalary:netSalary,
                dues:dues
        }}
      )
      .then(result=>{
        res.send(result.acknowledged)
      })
    })

     //Update Employee from paymentList
     app.patch('/workerUpdateEmployeeData/:id',(req,res)=>{
      const employeeData = req.body;
      const {status,netSalary,salaryType} = employeeData;
      workerCollection.updateOne(
        {_id:ObjectId(req.params.id)},
        {$set:{
                status:status,
                netSalary:netSalary,
                salaryType:salaryType
        }}
      )
      .then(result=>{
        res.send(result.acknowledged)
      })
    })

      //Update Employee salaryType
      app.patch('/updateSalaryType/:id',(req,res)=>{
        const employeeData = req.body;
        const {salaryType} = employeeData;
        EmployeeCollection.updateOne(
          {_id:ObjectId(req.params.id)},
          {$set:{
                  salaryType:salaryType,
          }}
        )
        .then(result=>{
          res.send(result.acknowledged)
        })
      })

    //Update Attendance
    app.patch('/updateAttendance/:id',(req,res)=>{
      const attendance = req.body;
      const {employeeId,name,date,inTime,outTime} = attendance;
      AttendenceCollection.updateOne(
        {_id:ObjectId(req.params.id)},
        {$set:{
                employeeId:employeeId,
                name:name,
                date:date,
                inTime:inTime,
                outTime:outTime
        }}
      )
      .then(result=>{
        res.send(result.acknowledged)
      })
    })


        //Update overtime
        app.patch('/updateOvertime/:id',(req,res)=>{
          const overtime = req.body;
          const {employeeId,name,date,inTime,outTime,reason} = overtime;
          OvertimeCollection.updateOne(
            {_id:ObjectId(req.params.id)},
            {$set:{
                    employeeId:employeeId,
                    name:name,
                    date:date,
                    inTime:inTime,
                    outTime:outTime,
                    reason:reason
            }}
          )
          .then(result=>{
            res.send(result.acknowledged)
          })
        })

          //Update announcement
          app.patch('/updateAnnouncement/:id',(req,res)=>{
            const announcement = req.body;
            const {title,startDate,endDate,department,summery,description} = announcement;
            AnnouncementCollection.updateOne(
              {_id:ObjectId(req.params.id)},
              {$set:{
                title: title,
                startDate: startDate,
                endDate: endDate,
                department: department,
                summery: summery,
                description: description
              }}
            )
            .then(result=>{
              res.send(result.acknowledged)
            })
          })


          //Update Designation
          app.patch('/updateDesignation/:id',(req,res)=>{
            const requirementData = req.body;
            const {department,role,designation} = requirementData;
            requirementCollection.updateOne(
              {_id:ObjectId(req.params.id)},
              {$set:{
                department:department,
                role:role,
                designation:designation
              }}
            )
            .then(result=>{
              res.send(result.acknowledged)
            })
          })


          //Update Role
          app.patch('/updateRole/:id',(req,res)=>{
            const requirementData = req.body;
            const {department,role,designation} = requirementData;
            requirementCollection.updateOne(
              {_id:ObjectId(req.params.id)},
              {$set:{
                department:department,
                role:role,
                designation:designation
              }}
            )
            .then(result=>{
              res.send(result.acknowledged)
            })
          })

           //Update department
           app.patch('/updateDepartment/:id',(req,res)=>{
            const departmentData = req.body;
            const {department} = departmentData;
            departmentCollection.updateOne(
              {_id:ObjectId(req.params.id)},
              {$set:{
                department:department
              }}
            )
            .then(result=>{
              res.send(result.acknowledged)
            })
          })

           //Update All Requirement department
           app.patch('/updateAllRequirement/:id',(req,res)=>{
            const requirementData = req.body;
            const {department} = requirementData;
            requirementCollection.updateMany(
              {department:req.params.id},
              {$set:{
                department:department,
              }}
            )
            .then(result=>{
              res.send(result.acknowledged)
            })
          })


  } finally {
  }
};
run();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
