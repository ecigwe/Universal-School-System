// const errorHandler = require('../utils/errorUtils/errorHandler')


// const staffOnly = (req, res, next) => {
//     const { category } = req.user;
//     if (category !== 'Staff') {
//         errorHandler(403, 'Unauthorized Access. For staff accounts only.');
//         return;
//     }
//     next();
// };

// const checkUserCanAccessSchoolRoute = (req, res, next) => {
//     const { school } = req.user;
//     if (req.params.id !== school) {
//         errorHandler(403, 'Unauthorized Access.');
//         return;
//     }
//     next();
// }

// module.exports = { staffOnly, checkUserCanAccessSchoolRoute };

//There are already existing authorization controllers located at ../controllers/middlewares.js