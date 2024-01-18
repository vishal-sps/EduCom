const { Router } = require('express');
const { createTrustedCompany, getAllTrustedCompanies, getTrustedCompanyById, updateTrustedCompanyById, deletedTrustedCompanyById } = require('../controller/trustedCampaniesController');
const trustedCompaniesRouter = Router();



trustedCompaniesRouter.post("/create", createTrustedCompany);
trustedCompaniesRouter.get("/getAll", getAllTrustedCompanies);
trustedCompaniesRouter.get("/:id", getTrustedCompanyById)
trustedCompaniesRouter.put("/update/:id", updateTrustedCompanyById)
trustedCompaniesRouter.delete("/:id", deletedTrustedCompanyById)





module.exports = trustedCompaniesRouter;
