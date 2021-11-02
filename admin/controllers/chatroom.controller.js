const Chatroom = require("../models/Chatroom");

exports.create = async(req, res) => {
    const { name } = req.body;
    if (!name) throw "Room requires name";

    const chatroom = new Chatroom({ name });
    await chatroom.save();

    res.status(201).json({ msg: `Room ${name} created` });
};

exports.list = async(req, res) => {
    Chatroom.find({}, (err, docs) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(docs);
    })
}