const router = require('express').Router()

// GET 
router.get("/", (req, res) => res.send("Get All"))
router.get("/:id", (req, res) => res.send("Get Single by ID"))
router.get("/search", (req, res) => res.send("Get Single by Title"))

// POST 
router.post("/", (req, res) => res.send("Hello Books"))

// PUT 
router.put("/:id", (req, res) => res.send("Hello Books"))

// DELETE 
router.delete("/:id", (req, res) => res.send("Hello Books"))


module.exports = router;