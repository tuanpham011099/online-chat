const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async(req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) throw "Invalid data";
    if (!email.includes('@') || !email.includes('.com')) throw "This is not email";

    let userFind = await User.findOne({ email });
    if (userFind) throw "User exist";

    if (password.length < 6) throw "Password not secure enough";

    let hashedPass = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPass });

    await user.save();

    res.status(200).json({ msg: `${name} created` });
};


exports.login = async(req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw "Invalid data";
    let user = await User.findOne({ email });
    if (!user) throw "No user with this email";
    let is_match = await bcrypt.compare(password, user.password);
    if (!is_match) throw 'Wrong password';

    let token = await jwt.sign({ id: user._id }, process.env.SECRET);

    res.status(200).json({ token, user: user.name, msg: "Logged in" });
}