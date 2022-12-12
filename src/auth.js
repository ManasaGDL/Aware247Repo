class Auth {
    constructor() {
      this.authenticated = false;
    }
  
    login(cb) {
      this.authenticated = true;
      cb();
    }
  
    logout(cb) {
      this.authenticated = false;
      cb();
    }
  
    isAuthenticated() {
      let access_token = localStorage.getItem("access_token");
      return this.authenticated || access_token;
    }
  }
  
  export default new Auth();
  