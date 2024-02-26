//Middleware included to confirm User Roles for site permissions and access 

//function receives parameters of allowed Roles (i.e. Admin or Editor)
const verifyRoles = (...allowedRoles) => {

    return (req, res, next) => {

        //Check if the role for a logged session exists. 
        if(!req.session.role) return res.render('../views/login.ejs', { message: 'User is not logged in. Please log in' });


        //set roles as the current session roles
        const roles = req.session.role;

        //set an array of roles listing out the received parameters
        const rolesArray = [...allowedRoles];

        //initiate testValue for roles
        let testValue = false;
        //loop through the properties of the current user roles 
        for (const property in roles){

            //if the role array is included in the current user role list 
            if(rolesArray.includes(roles[property])){

                //set testValue to equal true
                testValue = true;

                

                
            }
        }

        //set the result to testValue
        const result = testValue;
        //if the result is false return the appropriate message to user
        if(!result) return res.render('../views/home.ejs', {user:req.session.user, message: 'User is not authorized to complete action' });
        next();
    
    }
}

module.exports = verifyRoles;
