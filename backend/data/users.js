import bcrypt from 'bcryptjs';

const users = [
    {
        sponser: null,
        name: 'super-admin',
        email: 'seclobclt@gmail.com',
        phone: 9876543230,
        address: "Cyberpark, Calicut",
        packageChosen: null,
        password: bcrypt.hashSync('sAdmin@5959', 10),
        isAdmin: true,
        isSuperAdmin: true,
        ownSponserId: "7hhmKA8",
        screenshot: null,
        referenceNo: null,
        earning: 0,
        unrealisedEarning: [],
        userStatus: "approved",
        children: [],
        unrealisedSalary: 0
    },
]

export default users;