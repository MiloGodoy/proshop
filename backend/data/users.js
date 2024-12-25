import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Admin User',
        email: 'milogodoy@google.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true,
    },
    {
        name: 'John Doe',
        email: 'john@google.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: false,
    },
    {
        name: 'Jane Doe',
        email: 'jane@google.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: false,
    }
]

export default users;