const router = require('express').Router()

// GET 
router.get("/", (req, res) => res.send("Get All"))
router.get("/:id", (req, res) => res.send("Get Single by ID"))
router.get("/search", (req, res) => res.send("Get Single by Name and Lastname"))

// POST 
router.post("/", (req, res) => res.send("Hello Authors"))

// PUT 
router.put("/:id", (req, res) => res.send("Hello Authors"))

// DELETE 
router.delete("/:id", (req, res) => res.send("Hello Authors"))


module.exports = router;