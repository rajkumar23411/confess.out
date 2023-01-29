const Confession = require("../models/confession");
const moment = require("moment");
const confessionController = {
  add(req, res) {
    res.render("addConfession", {
      title: "Add confession",
      req: req,
    });
  },
  async postConfession(req, res) {
    try {
      const { heading, message } = req.body;

      if (!heading || !message) {
        req.flash("error", "All fields are required");

        req.flash("heading", heading);
        req.flash("message", message);

        return res.redirect("/add/confession");
      }

      await Confession.create({
        heading,
        message,
        user: req.user._id,
      });

      req.flash("success", "Confession added");
      return res.redirect("/confessions");
    } catch (err) {
      console.log(err);
      return req.flash("err", { message: "Something went wrong" });
    }
  },
  async singleConfession(req, res) {
    try {
      const confession = await Confession.findOne({
        _id: req.params.id,
      }).populate("user", "avatar");

      if (!confession) {
        req.flash("success", "Confession not found");
        return res.redirect("/");
      }
      return res.render("singleConfession", {
        title: "Confession",
        moment,
        confession,
      });
    } catch (err) {
      console.log(err);
      return req.flash("error", err);
    }
  },
  async deleteConfession(req, res, next) {
    try {
      const confession = await Confession.findById(req.params.id);

      if (!confession) {
        req.flash("success", "Confession not found");
        return res.redirect("/confessions");
      }
      await confession.remove();

      req.flash("success", "Confession deleted");
      return res.redirect("/confessions");
    } catch (error) {
      console.log(error);
    }
  },
  async allConfessions(req, res) {
    const confessions = await Confession.find({ user: req.user._id });
    return res.render("allConfessions", {
      title: "All Confessions",
      confessions,
      moment: moment,
    });
  },
  async getEditConfession(req, res) {
    try {
      const confession = await Confession.findById(req.params.id);

      console.log(confession);

      if (!confession) {
        return req.flash("error", "Post Not Found");
      }

      return res.render("editPost", {
        title: "Edit Confession",
        confession,
      });
    } catch (err) {
      console.log(err);
      return req.flash("error", "something went wrong");
    }
  },
  async postEditConfession(req, res) {
    const confession = await Confession.findById(req.params.id);
    const { heading, message } = req.body;

    if (!heading || !message) {
      req.flash("error", "All fields are required");
      return res.redirect(`/confession/edit/${confession._id}`);
    }

    confession.heading = heading;
    confession.message = message;

    await confession.save();

    req.flash("success", "Confession updated");
    return res.redirect("/confessions");
  },
  async reportPost(req, res) {
    try {
      const { postId, reason } = req.body;
      const confession = await Confession.findById(postId);

      if (!confession) {
        req.flash("success", "Confession not found");
        return res.redirect("/");
      }
      let isReported = false;
      confession.reports.forEach((report) => {
        if (report.user === req.user._id.toString()) {
          isReported = true;
        }
      });

      if (isReported) {
        confession.reports.forEach((report) => {
          if (report.user === req.user._id.toString()) {
            report.reason = reason;
            report.reportedAt = Date.now();
          }
        });
      } else {
        confession.reports.push({
          user: req.user._id,
          reason: reason,
          reportedAt: Date.now(),
        });
      }

      await confession.save();

      if (confession.reports.length >= 10) {
        await confession.delete();
      }

      req.flash("success", "Reported Successfully");
      return res.redirect("/");
    } catch (err) {
      req.flash("success", "Something went wrong");
      console.log(err);
      return res.redirect("/");
    }
  },
};
module.exports = confessionController;
