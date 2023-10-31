import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'super-admin',
        email: 'seclobclt@gmail.com',
        password: bcrypt.hashSync('sAdmin@5959', 10),
        isAdmin: true,
        isSuperAdmin: true
    },
]

export default users;