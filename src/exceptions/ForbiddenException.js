module.exports = function ForbiddenException(message) {
  this.status = 403;
  this.message = message || "You are not allowed to perform this action";
};
