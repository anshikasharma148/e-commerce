export const auth = {
  isLoggedIn: false,

  login(cb) {
    this.isLoggedIn = true;
    if (cb) cb();
  },

  logout(cb) {
    this.isLoggedIn = false;
    if (cb) cb();
  },
};
