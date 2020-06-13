class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    var user = { id, name, room };
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    //return user that was removed
    var user = this.getUser(id);
    if (user) {
      this.users = this.users.filter((user) => {
        return user.id !== id;
      });
    }
    return user;
  }

  getUser(id) {
    return this.users.filter((user) => {
      return user.id === id;
    })[0];
  }

  getUserList(room) {
    var usersObjects = this.users.filter((user) => {
      return user.room === room;
    });
    var namesArray = usersObjects.map((user) => {
      return user.name;
    });

    return namesArray;
  }

  containUser(name) {
    return (
      this.users.filter((user) => {
        return user.name === name;
      }).length > 0
    );
  }
}
module.exports = {
  Users,
};
