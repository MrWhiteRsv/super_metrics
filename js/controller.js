var controller = {
  
  localCash : {},
  
  /**
   * Get logged in username.
   */
  getUserName : function() {
    // TODO(White): set username when logging in, and store as cookie.
    return utils.getParsedQuery_()['username'];
  },
  
}