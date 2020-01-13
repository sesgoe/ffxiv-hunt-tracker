exports.isAuthenticated = async function(req, res, next) {

    if(!req.session.passport) {
        return res.status(401).end()
    }

    next()

}
