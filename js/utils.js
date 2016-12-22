var utils = {

  assert : function(condition, message) {
    if (!condition) {
      message = message || "Assertion failed";
      if (typeof Error !== "undefined") {
        throw new Error(message);
      }
      throw message; // Fallback
    }
  },
  
  isNumeric : function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },
  
}