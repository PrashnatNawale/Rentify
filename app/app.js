import mysql from "mysql";
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import ejs from "ejs";
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "PRASHANT70nawale38@",
    database: "rentify"
});
connection.connect((err, data) => {
    if (err) {
        console.log("Database is not connected");
    } else {
        console.log("Connection with ayushmanhospital Established..");
    }
});



const app = express();
const staticpath = "D:\\User\\admin\\Desktop\\Web Devlopment\\projects\\WD_Rentify\\template"
app.use(express.static(staticpath));
app.engine('html', ejs.renderFile)
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render(staticpath + "//index.html");
});

app.post("/register", (req, res) => {
    // Extracting form data from the request body
    const { first_name, last_name, phone_number, email, user_type, password } = req.body;

    const sql = `INSERT INTO users (u_email, u_fname, u_lname, u_contact, u_type, u_password) 
    VALUES (?, ?, ?, ?, ?, ?)`;

    // Values to be inserted into the table
    const values = [email, first_name, last_name, phone_number, user_type, password];

    // Execute the SQL query
    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            res.status(500).send("Error inserting data");
            return;
        }
        res.render(staticpath + "//login.html");
    });
});


app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // SQL query to check if the email and password match any record in the users table
    const sql = `SELECT * FROM users WHERE u_email = ? AND u_password = ?`;

    // Values to be used in the query
    const values = [email, password];

    // Execute the SQL query
    connection.query(sql, values, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).send("Error executing query");
            return;
        }

        if (results.length > 0) {
            // User authenticated
            const userType = results[0].u_type;

            // Redirect based on user type
            if (userType === 'seller') {
                res.render(staticpath + "//dashboard_seller.html");
            } else {
                res.render(staticpath + "//dashboard_buyer.html");
            }
        } else {
            // Invalid credentials, redirect back to the login page
            res.redirect('/login.html');
        }
    });
});

app.post("/submit-property", (req, res) => {
    const { type, bedrooms, bathrooms, location, amenities, contactNumber, monthlyRent, email, electricity, waterSupply } = req.body;

    // Determine water_supply and electricity availability based on checkbox values
    // const waterSupply = req.body.waterSupplyCheckbox ? 'available' : 'unavailable';
    // const electricity = req.body.electricityCheckbox ? 'available' : 'unavailable';
    console.log(waterSupply, electricity);

    // SQL query to insert property data into the table
    const sql = `INSERT INTO properties (type, bedrooms, bathrooms, water_supply, electricity, location, amenities, contact_number, monthly_rent, email_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Values to be inserted into the table
    const values = [type, bedrooms, bathrooms, waterSupply, electricity, location, amenities, contactNumber, monthlyRent, email];

    // Execute the SQL query
    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            res.status(500).send("Error inserting data");
            return;
        }
        alert("Data inserted sucessfully.");
        res.render(staticpath + "//dashboard_seller.html");
    });
});

app.get('/properties/:email', (req, res) => {
    let email = req.params.email; // Assuming user email is stored in session
    // console.log(userEmail);
    console.log(email);
    // Query the database to fetch properties associated with the user's email
    const sql = `SELECT * FROM properties WHERE email_id = '${email}'`;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching properties:', err);
            res.status(500).json({ error: 'Error fetching properties' });
            return;
        }

        console.log(results);
        // Send the fetched properties as JSON response
        res.json(results);
    });
});

app.get('/properties', (req, res) => {
    let email = req.params.email; // Assuming user email is stored in session
    // console.log(userEmail);
    console.log(email);
    // Query the database to fetch properties associated with the user's email
    const sql = `SELECT * FROM properties`;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching properties:', err);
            res.status(500).json({ error: 'Error fetching properties' });
            return;
        }

        console.log(results);
        // Send the fetched properties as JSON response
        res.json(results);
    });
});



app.listen(8000);