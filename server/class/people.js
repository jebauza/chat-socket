class People {

    constructor() {
        this.users = [];
    }

    addUser(id, name, room, photo) {
        let user = { id, name, room, photo };

        this.users.push(user);

        return user;
    }

    getUser(userID) {
        return this.users.find(u => u.id === userID);
    }

    getUsers(room = null) {

        if (room) {
            return this.users.filter(u => u.room === room);
        }

        return this.users;
    }

    getUserPerRoom(room) {
        // ...
    }

    deleteUser(userID) {
        let userDelete = this.getUser(userID);

        this.users = this.users.filter(u => u.id != userID);

        return userDelete;
    }

}




module.exports = {
    People
}