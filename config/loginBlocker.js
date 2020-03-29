module.exports = function (request, response, next) {
    if (!request.user) {
        request.flash("error", "You must be signed in");
        response.redirect("/auth/signin");
    } else {
        next();
    }
};