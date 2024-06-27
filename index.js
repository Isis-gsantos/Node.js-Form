const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const validator = require("validator");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cookieParser("jsodijiasojd"));
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

app.use(flash());

app.get("/", (req, res) => {
    let emailError = req.flash("emailError");
    let nameError = req.flash("nameError");
    let passwordError = req.flash("passwordError");
    let confirmPasswordError = req.flash("confirmPasswordError");

    let email = req.flash("email");
    let name = req.flash("name");
    let password = req.flash("password");
    let confirmPassword = req.flash("confirmPassword");

    email = (email == undefined || email.length == 0) ? "" : email
    name = (name == undefined || name.length == 0) ? "" : name
    password = (password == undefined || password.length == 0) ? "" : password;
    confirmPassword = (confirmPassword == undefined || confirmPassword.length == 0) ? "" : confirmPassword;

    res.render("index", {
        emailError, nameError, passwordError, confirmPasswordError, email: email, name: name, password: password, confirmPassword: confirmPassword
    });
});

function validateFormData(email, name, password, confirmPassword) {
    let errors = {};

    if (!validator.isEmail(email)) {
        errors.emailError = "The e-mail is invalid";
    } else if (validator.isEmpty(email)) {
        errors.emailError = "E-mail can't be empty";
    }

    if (validator.isEmpty(name)) {
        errors.nameError = "Name can't be empty";
    } else if (!validator.isLength(name, { min: 3 })) {
        errors.nameError = "Name is too small";
    }

    if (validator.isEmpty(password)) {
        errors.passwordError = "Password can't be empty";
    } else if (!validator.isLength(password, { min: 6 })) {
        errors.passwordError = "Password must be at least 6 characters long";
    }

    if (password !== confirmPassword) {
        errors.confirmPasswordError = "Passwords do not match";
    }

    return errors;
}

app.post("/signed", (req, res) => {
    const {email, name, password, confirmPassword} = req.body;
    const errors = validateFormData(email, name, password, confirmPassword);

    if (Object.keys(errors).length > 0) {
        req.flash("emailError", errors.emailError);
        req.flash("nameError", errors.nameError);
        req.flash("passwordError", errors.passwordError);
        req.flash("confirmPasswordError", errors.confirmPasswordError);

        req.flash("email", email);
        req.flash("name", name);
        req.flash("password", password);
        req.flash("confirmPassword", confirmPassword);
        
        res.redirect("/");
    } else {
        res.render("signed");
    }
});

app.listen(8080, (req, res) => {
    console.log("App running");
});