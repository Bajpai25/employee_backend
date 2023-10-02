
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const UserAdd = require('./Add');
const app = express();
const User = require('./User');
app.use(cors());
app.use(express.json());
const db_url = "mongodb+srv://bajpaishashwat332:CAvEsN4ZbnHwOLNw@cluster0.ehdqcrx.mongodb.net/?retryWrites=true&w=majority";
const PORT =  process.env.PORT || 5000;
const connection_params = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect(db_url, connection_params)
    .then(() => {
        console.log("Connected");
    })
    .catch((err) => {
        console.log("Error is", err);
    })

app.post('/register', register_details);

async function register_details(req, res) {
    console.log(req.body);
    const { first, last, email, password } = req.body;

    if (!email) {
        return res.status(400).json({
            message: 'Email is required',
        });
    }

    try {
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.json({
                message: 'Email already exists',
            });
        }

        await User.create({
            first,
            last,
            email,
            password, // Assuming you're not hashing the password anymore
        });

        res.json({
            message: 'User created !!',
            data: req.body,
        });
    } catch (err) {
        console.error('Error in creating user', err);
        res.status(500).json({
            message: 'Internal server error',
        });
    }
}

app.post('/add', add_employee)
async function add_employee(req, res) {
    console.log(req.body);
    const { name, email, password, address, salary } = req.body;
    await UserAdd.create({
        name, email, password, address, salary
    })
    res.json({
        message: "Employee added successfully",
        data: req.body
    })
}

app.post('/login', login_details)
async function login_details(req, res) {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email,password });
  if(!user){
     return res.json({
         message:'Invalid email or password!'
     })
  }
    if (res.status(201)) {
        return res.json({
            message: "Login successful",
        })
    } else {
        res.json({
            message: "error"
        })
    }
    res.json({
        message: "invalid password"
    })
}

app.get("/getdata", get_data);
async function get_data(req, res) {
    try {
        const allusers = await UserAdd.find({});
        res.send({
            status: "ok", data: allusers
        })
    }
    catch (err) {
        console.log(err);
    }
}

app.get("/get/:id", get_data_by_id);
async function get_data_by_id(req, res) {
    const id = req.params.id;
    const data_by_id = await UserAdd.findById(id);
    res.json({
        status: "successfull",
        data: data_by_id
    })
}

app.patch('/update/:id', update_data);

async function update_data(req, res) {
    const id = req.params.id; // Get the ID from the URL
    const { name, email, password, address, salary } = req.body; // Get updated data from the request body

    try {
        // Use Mongoose to find the document by ID and update it
        const updatedEmployee = await UserAdd.findByIdAndUpdate(
            id,
            {
                name,
                email,
                password, // Assuming you're not hashing the password anymore
                address,
                salary,
            },
            { new: true } // Return the updated document
        );

        if (!updatedEmployee) {
            return res.status(404).json({ status: 'error', message: 'Employee not found' });
        }

        res.status(200).json({ status: 'success', data: updatedEmployee });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}

app.delete('/delete/:id', delete_data);
async function delete_data(req, res) {
    const id = req.params.id;
    const deleted_data = await UserAdd.findByIdAndDelete(id);
    if (!deleted_data) {
        res.json({
            message: "Data is not deleted"
        })
    }
    else {
        res.json({
            status: "data deleted successfully",
            data: deleted_data

        })
    }
}

app.listen(PORT, () => {
    console.log("server is running")
})
