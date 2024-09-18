const connection = require('../db.config/db.config');
const responseStructure = require('../utils/responseStructure')

const register = async (req, res) => {
    try {

        const { username, email, password } = req.body.insertObject;
        const table = req.body.table
       

        var selectEmail  = `SELECT user.username  FROM  `+table+` WHERE email = "`+email+`"`
        connection.query(selectEmail,async (err, results) => {
            if(results && results[0] ){
                let responseMessage = responseStructure.errorResponse('user already exsist');
                res.send(responseMessage);
            }else{

                var insertSql =`INSERT INTO `+table+` (username, email, password) VALUES ("`+username+`","`+email+`","`+password+`")`

                connection.query(insertSql,async (err, result) => {
                    if(result){

                        let responseMessage = responseStructure.successResponse('User Register Successfully');
                        res.send(responseMessage);

                    }else{
                        let responseMessage = responseStructure.errorResponse('Error In Register User');
                        res.send(responseMessage);

                    }

                })

            }
        })

        
    } catch (error) {
        
    }
};

const login = async(req,res)=>{
    try {
        const {email,password} = req.body.insertObject

        var selectUser = `SELECT user.username from user where user.email = "`+email+`" AND user.password = "`+password+`"`

        connection.query(selectUser,(err,result) =>{
            if(result && result[0] && result[0]['username']){
               let responseMessage = responseStructure.successResponse('Login Successfully');
               res.send(responseMessage);
            }else{
                let responseMessage = responseStructure.errorResponse('Check Username and Password');
                res.send(responseMessage);

            }
        }) 
        
    } catch (error) {
        
    }
}

module.exports = {register,login}
