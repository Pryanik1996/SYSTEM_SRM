const { Router } = require("express");
const router = Router();
const Comment = require("../db/models/commentModel");
const Client = require("../db/models/clientModel");
const User = require("../db/models/userModel");

router.get("/card", async (req, res) => {
  try {
    const clients = await Client.find({ isDelete: false });
    res.json(clients);
  } catch (err) {
    res.sendStatus(404);
  }
});

router.post("/new", async (req, res) => {
  const { name, surname, patronymic, email, phone, address } = req.body;
  const id = req.session.passport.user?._id;
  try {
    if (name) {
      const newClient = await Client.create({
        name,
        surname,
        patronymic,
        email,
        phone,
        address,
        creator: id,
      });

      res.json(newClient);
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(403);
  }
});

router.get("/all", async (req, res) => {
  try {
    const allClients = await Client.find({ isDelete: false });
    res.json(allClients);
  } catch (err) {
    res.sendStatus(400);
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, surname, patronymic, email, phone, address } = req.body;

  try {
    const data = await Client.findByIdAndUpdate(id, {
      name,
      surname,
      patronymic,
      email,
      phone,
      address,
    });
    const response = await Client.findById(id).populate("comments");

    res.json(response);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const client = await Client.findById(id)
      .populate("comments")
      .populate("orders");
    // console.log(client);
    console.log("QQQQQQ=>>>", client);

    res.json(client);
  } catch (err) {
    console.log(err);
  }
});

router.patch("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Client.findByIdAndUpdate(
      id,
      { isDelete: true },
      { new: true }
    );
    const client = await Client.find({ isDelete: false });
    res.json(client);
  } catch (err) {
    console.log(err);
  }
});

router.post("/:id", async (req, res) => {
  const { body, userId, userName } = req.body;
  const cardId = req.params.id;
  try {
    const author = await User.findById(userId);
    let dat = new Date();
    let options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    let dateNow = dat.toLocaleString("ru-RU", options);
    const newComment = await Comment.create({
      authorId: userId,
      author: userName,
      body,
      date: dateNow,
      card: cardId,
    });
    const commentClient = await Client.findByIdAndUpdate(
      cardId,
      { $push: { comments: newComment._id } },
      { new: true }
    ).populate("comments");
    res.json(commentClient);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
