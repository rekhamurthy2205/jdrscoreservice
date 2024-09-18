const responseStructure = require('../utils/responseStructure');
const importedModal = require('./models/modelImporter');
const { login } = require('./user.controller');

const insertRequests = async (req, res) => {
  let responseMessage;
  try {

    const dbName = req.body.dbName;
    const collection_name = await importedModal(dbName);
    const createData = req.body.insertdata;
    const createReqApi = new collection_name(createData);
    if (Object.keys(createData).length > 0) {
      await collection_name.insertMany(createData).then((result, error)  => {
        if (error) {
          responseMessage = responseStructure.errorResponse('Error in create data');
          res.send(responseMessage);
        } else {
          responseMessage = responseStructure.successResponse('Successfully inserted value');
          res.send(responseMessage);
        }
      });
    }
  } catch (error) {
    responseMessage = responseStructure.errorResponse('Error in insertdata');
    res.send(responseMessage);
  }
};

const readById = async (req, res) => {
  let responseMessage;
  try {
    const dbName = req.body.dbName;
    const collection_name = await importedModal(dbName);
    const Id = req.body.RequestId;
    await collection_name.findById(Id).then((result, error) => {
      if (error) {
        responseMessage = responseStructure.errorResponse('Unable to find Id');
        res.send(responseMessage);
      } else {
        responseMessage = responseStructure.successResponse(result);
        res.send(responseMessage);
      }
    });
  } catch (error) {
    responseMessage = responseStructure.errorResponse('Error in getting data');
    res.send(responseMessage);
  }
};


const readRequests = async (req, res) => {
  try {
    const dbName = req.body.dbName;
    const collection_name = await importedModal(dbName); // Assuming importedModal returns a Mongoose model
    const { page, size } = req.body.pagination;

    const skip = (page - 1) * size;
    const limit = size;

    const aggregationPipeline = [
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit }
          ],
          totalCount: [
            { $count: "count" }
          ]
        }
      },
      {
        $project: {
          data: 1,
          totalCount: { $arrayElemAt: ["$totalCount.count", 0] }
        }
      }
    ];

    const result = await collection_name.aggregate(aggregationPipeline).exec();

    const totalDocuments = result[0].totalCount || 0;
    const documents = result[0].data;

    const responseMessage = responseStructure.successResponse({
      message: 'Data retrieved successfully',
      data: documents,
      dataLength: documents.length,
      totalPages: Math.ceil(totalDocuments / limit),
      currentPage: page
    });

    res.send(responseMessage);
  } catch (error) {
    const responseMessage = responseStructure.errorResponse('Error in reading data');
    res.send(responseMessage);
  }
};


const updateManyRequests = async (req, res) => {
  let responseMessage;
  try {
    const dbName = req.body.dbName;
    const collection_name = await importedModal(dbName); // Assuming importedModal returns a Mongoose model
    const updateData = req.body.updateData;
    const Id = req.body._id;

    await collection_name.findByIdAndUpdate(Id, updateData).then((result) => {
      if (result === 0) {
        responseMessage = responseStructure.errorResponse('Unable to find matching documents to update');
        res.send(responseMessage);
      } else {
        responseMessage = responseStructure.successResponse('Successfully updated the documents');
        res.send(responseMessage);
      }
    }).catch((error) => {
      console.log(error);
      responseMessage = responseStructure.errorResponse('Error occurred while updating documents');
      res.send(responseMessage);
    });

  } catch (error) {
    console.log(error);
    responseMessage = responseStructure.errorResponse('Error in updating documents');
    res.send(responseMessage);
  }
};


const deleteRequest = async (req, res) => {
  let responseMessage;
  try {
    const dbName = req.body.dbName;
    const collection_name = await importedModal(dbName);
    const Id = req.body.RequestId;
    await collection_name.findByIdAndDelete(Id).then((result) => {
      if (result) {
        responseMessage = responseStructure.successResponse('data was deleted Successfully');
        res.send(responseMessage);
      } else {
        responseMessage = responseStructure.errorResponse('unable to find Id');
        res.send(responseMessage);
      }
    });
  } catch (error) {
    responseMessage = responseStructure.errorResponse('Error in deletion');
    res.send(responseMessage);
  }
};

const searchData = async (req, res) => {
  let responseMessage;
  try {
    const { tableName } = req.body;
    const { page, size } = req.body.pagination;
    const searchKey = req.body.keyword;
    model[tableName]
      .findAndCountAll({
        where: searchKey,
        limit: size,
        offset: page * size
      })
      .then((result, error) => {
        if (error) {
          responseMessage = responseStructure.errorResponse('Error in searchKey');
          res.send(responseMessage);
        } else {
          const limit = size,
            responseMessage = responseStructure.successResponse({
              message: 'Data retrieved successfully',
              data: result,
              dataLength: result.length,
              totalPages: Math.ceil(result.count / limit)
            });
          res.send(responseMessage);
        }
      });
  } catch (error) {
    responseMessage = responseStructure.errorResponse('Error in search data');
    res.send(responseMessage);
  }
};

module.exports = {
  insertRequests,
  readById,
  readRequests,
  updateManyRequests,
  deleteRequest,
  searchData
};