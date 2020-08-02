const reportHelp = {
  id: {},
  setId(get) {
    this.id = get;
    return true;
  },
  getId() {
    return this.id;
  }
};

export default reportHelp;
