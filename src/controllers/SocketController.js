const SocketController = function () {
  this.name = "name";
  return {
    init: () => {
      console.log("this.name", this.name);
    },
  };
};

export default SocketController;
