
exports.getDate = function() {
    return new Date().toLocaleString("en-us", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
}