const mapHelp = {
  Location: [60.43, 10.17],
  isClick: true,
  id: "",
  setLocation(isClick, location, id) {
    this.Location = location;
    this.isClick = isClick;
    this.id = id;
    return true;
  },
  getLocation() {
    // if (this.isClick) {
    return this.Location;
    // }
  },
  getClicked() {
    return this.isClick;
  },
  getId() {
    return this.id;
  }
};

export default mapHelp;
