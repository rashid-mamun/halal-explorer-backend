const express = require('express');
const router = express.Router();

const insuranceController = require('../controller/insurance');
const adminInsuranceController = require('../controller/adminPanelInsurance');


router.get('/policy-type', insuranceController.getPolicyTypes);
router.post('/policy-type', insuranceController.createPolicyType);

router.get('/area', insuranceController.getAreas);
router.post('/area', insuranceController.createArea);

router.get('/country', insuranceController.getCountries);
router.post('/country', insuranceController.createCountry);

router.post('/traveller-type', insuranceController.createTravellerType);
router.get('/traveller-type', insuranceController.getTravellerTypes);

router.get('/rest-type', insuranceController.getRestTypes);
router.post('/rest-type', insuranceController.createRestType);

router.get('/age-group', insuranceController.getAgeGroups);
router.post('/age-group', insuranceController.createAgeGroup);

router.get('/product-name', insuranceController.getProductNames);
router.post('/product-name', insuranceController.createProductName);

router.get('/duration', insuranceController.getDurations);
router.post('/duration', insuranceController.createDuration);

router.post('/admin', adminInsuranceController.createInsurance); 
router.get('/admin', adminInsuranceController.getInsurances); 
router.get('/admin/search', adminInsuranceController.getAllInformationController);

router.get('/admin/:id', adminInsuranceController.getInsuranceByIdController); 
router.put('/admin/:id', adminInsuranceController.updateInsuranceByIdController); 
router.delete('/admin/:id', adminInsuranceController.deleteInsuranceByIdController); 



router.post('/search', adminInsuranceController.searchInsuranceController);



module.exports = router;
