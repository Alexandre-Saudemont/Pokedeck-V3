const Types  = require ('../Models/typesModel.js');

const typesController = {
    getAllTypes : async (req, res) => {
        try {
            const allTypes = await Types.findAll();
            return res.status(200).json(allTypes);
        } catch (error) {
            console.error(error);
            return res.status(404).json({error:"Un problème est survenu sur la route getAllTypes"})
        }
    }
  
}

module.exports = typesController;