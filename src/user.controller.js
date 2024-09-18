const { LOG } = require('../utils/logger');
const responseStructure = require('../utils/responseStructure');
const importedModal = require('./models/modelImporter');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  let responseMessage;
  try {
    const dbName = req.body.dbName;
    const collection_name = await importedModal(dbName);
    const { username, email, password, role } = req.body.insertData;

   
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createData = {
      username,
      email,
      password: hashedPassword,
      role
    };

    if (Object.keys(createData).length > 0) {
      await collection_name.insertMany([createData])
        .then(result => {
          responseMessage = responseStructure.successResponse('Your registartion done successfully');
          res.send(responseMessage);
        })
        .catch(error => {
          console.log(error);
          responseMessage = responseStructure.errorResponse('Error in registration');
          res.status(500).send(responseMessage);
        });
    }
  } catch (error) {
    LOG.error('Error in processing registration:', error);
    responseMessage = responseStructure.errorResponse('Error in processing registration');
    res.status(500).send(responseMessage);
  }
};


const login = async(req,res)=>{
    try {
 

      const dbName = req.body.dbName;
      const collection_name = await importedModal(dbName);
        const { email, password } = req.body.insertData;
  
        const user = await collection_name.findOne({ email });
        if(user){
            const isMatch = await bcrypt.compare(password, user.password);

            if(isMatch){
            
              const responseMessage = responseStructure.successResponse('Login successfully');
              responseMessage.responseObj.responseDataParams.userId = user;
              res.status(200).send(responseMessage );
              
            }else{
                const responseMessage = responseStructure.errorResponse('Yor password was not matching');
                return res.status(400).send(responseMessage);

            }

        }else{
            const responseMessage = responseStructure.errorResponse('Unable to find user');
            return res.status(404).send(responseMessage);  
        }
        
    } catch (error) {
      console.log(error);
        
    }
}
  


module.exports = {register,login}