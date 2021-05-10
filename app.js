const express = require('express');
//Require express validator check(Check before request)  body(Check with request info) validationResults(validation info)
const {check, body, validationResult} = require('express-validator')
const app = express()
//Require express sesion to pass into from register to index
const session = require('express-session')

app.set('view engine', 'ejs')


//Middleware to parse info
const urlencodedParser = express.urlencoded({ extended: false })
//Save data on cookies
//Execute app Sesion 
app.use(session({
                secret: 'mySecret', //Compute the hash
                resave: false, 
                saveUninitialized: false
            }));

//Navigation
app.get('/', (req, res) =>{
    var registered = req.session.message;
    console.log("Registered value = to "+registered)
    res.render('index', {       //Render index and other values to be print in EJS
        title: "Login",
        success: false,
        registered: registered
        //errors: req.session.errors,
    });
    //Clean last session errors
    req.session.errors = null
})

app.get('/register', (req, res)=> {
    res.render('register')
})
//Post and parse data
app.post('/register', urlencodedParser,[
    //Validate fields with check() and metods.
    check('username', "This user exitst")
        .exists()
        .isLength({ min: 6 }),
    check('email', 'Email is not valid')
         .isEmail()
         .normalizeEmail(),
    check('confirmPassword'),

    check('password', 'Password is invalid')
        .isLength({min: 4})
        .custom((value,{ req }) => { //Define a custom function to check if passwords are equals, getting info of req 
           
            if (value !== req.body.passwordConfirm) {
                // trow error if passwords do not match
                throw new Error("Passwords don't match");
            } else {
                return value;
            }
        })
        
     
], (req, res)=> {
    
    //Save validation result as error

    const errors = validationResult(req)
   
    if(!errors.isEmpty()) {
        //return res.status(422).jsonp(errors.array())
       //Save errors
        let alert = errors.array()
        res.render('register',{
            alert                   //return errors
        })
        return                      //Stop execution
    }
    //res.json(req.body) //use this to see validated info
    //let registered message
req.session.message = "Succesfully registered"

 res.redirect('/')
    return
})

app.listen(3000, () => console.info("App corriendo"))



