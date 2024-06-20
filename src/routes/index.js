const contactsController = require('../controller/contactsController')
exports.applyRoutes = (app) => {
    app.post('/v1/identify',contactsController.getContctsController())
    return app
}