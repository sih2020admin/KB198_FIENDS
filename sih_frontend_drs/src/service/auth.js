const Authentication = {
  token: "1234",
  setToken(get) {
    this.token = get;
  },
  getToken() {
    return this.token;
  }
};

export default Authentication;
