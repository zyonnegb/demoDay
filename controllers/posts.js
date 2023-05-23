const cloudinary = require("../middleware/cloudinary");
const nodemailer = require('nodemailer');
require('dotenv').config();

const Key = require("../models/Key")
const Review = require("../models/Review")




module.exports = {
  sendEmail: async (req, res) => {
    console.log(req.body)
    let key = req.body.productKey
    let product = req.body.productName
    let review = req.body.productReview
    let size = req.body.productSize
    let user = req.body.user
    let rating = req.body.rating
    let email = req.body.email
    const password = process.env.PASSWORD;

    try {
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'swiqo10@gmail.com',
          pass: password
        }
      });
      var mailOptions = {
        from: 'swiqo10@gmail.com',
        to: email,
        subject: `${product} Review - ${key}`,
        text: 
        `Product - ${product}
        Size - ${size}
        Review - ${review}
        Rated - ${rating}
        Reviewd By - ${user}
        `
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Saved! ' + info.response);
        }
      });
      res.redirect("/browse");

    } catch (err) { 
      console.log(err);
    }
  },



  // ---------- Get Routes
  // Gets Browse Page
  getBrowse: async (req, res) => {
    try {
      const keys = await Key.find({userEmail: req.user.email});
      const reviews = await Review.find();
      res.render("browse.ejs",{ keys: keys, reviews: reviews});
    } catch (err) {
      console.log(err);
    }
  },
  getReviews: async (req, res) => {
    try {
      const keys = await Key.find({userEmail: req.user.email});
      const reviews = await Review.find({userEmail: req.user.email});
      res.render("reviews.ejs",{ keys: keys, reviews: reviews});
    } catch (err) {
      console.log(err);
    }
  },
  getSearch: async (req, res) => {
    console.log(req.query.key)
    try {
      //Assigning Variables
      let key = req.query.key.toUpperCase()
      let product = req.query.product
      //Regex
      const searchString = product; // the string you want to search for in the productName field
      const regex = new RegExp(searchString, "i"); // create a regular expression with 'i' flag to make it case-insensitivy
      //Searches Database
      const reviews = await Review.find({key: key, productName: {$regex: regex}});
      //Gets Keys For Dropdown
      const keys = await Key.find({userEmail: req.user.email});
      
      res.render("browse.ejs",{keys: keys, reviews: reviews});
    } catch (err) {
      console.log(err);
    }
  },
  getView: async (req, res) => {
    //Finds Keys By User Email
    const keys = await Key.find({userEmail: req.user.email});
    try {
      res.render("view.ejs", {keys: keys});
    } catch (err) { 
      console.log(err);
    }
  },
  //Gets Create Key Page
  getCreate: async (req, res) => {
    try {
      // const post = await Post.findById(req.params.id);
      // const comments = await Comment.find({postId: req.params.id});
      res.render("create.ejs");
    } catch (err) { 
      console.log(err);
    }
  },
  //Gets Upload Page
  getUpload: async (req, res) => {
    const keys = await Key.find({userEmail: req.user.email});
    try {
      res.render("upload.ejs",{ keys: keys });
    } catch (err) { 
      console.log(err);
    }
  },

  //Gets Delete Key Page, Inserts Keys From User
  getDelete: async (req, res) => {
    const keys = await Key.find({userEmail: req.user.email});
    try {
      res.render("delete.ejs",{ keys: keys });
    } catch (err) { 
      console.log(err);
    }
  },

  // ---------- Key Routes
  // Create Key
  createKey: async (req, res) => {
    //Assigns Measurements To Variables
    let feet = req.body.feet
    let inches = req.body.inches
    let lbs = req.body.lbs
    let key = `${feet}F${inches}I${lbs}LBS`
    //Validatrs Measurements Are Realist
    if (feet < 2 || feet > 7){ res.redirect("/create")
      console.log('Enter Correct Feet')
      return }
    if (inches < 0 || inches >= 12){ res.redirect("/create")
      console.log('Enter Correct Inches')
      return }
    if (lbs < 5 || lbs >= 1000){ res.redirect("/create")
      console.log('Enter Correct Lbs')
      return }
    if(lbs % 5 != 0){res.redirect("/create")
      console.log('Must Be Multiple Of 5')
      return }
      try {
      await Key.create({
        feet: feet,
        inches: inches,
        lbs: lbs,
        key: key,
        user: req.user.userName,
        userEmail: req.user.email
      });
      console.log("Key has been added!");
      res.redirect("/create");
    } catch (err) {
      console.log(err);
    }
  },
  // Delete Key
  deleteKey: async (req, res) => {
    try {
      await Key.remove({key: req.body.key, userEmail: req.user.email});
      console.log("Deleted Key");
      res.redirect("/delete");
    } catch (err) {
      res.redirect("/delete");
    }
  },
  deleteReview: async (req, res) => {
    try {
      // Find Key
      // let review = await Review.find({productName: req.body.name});
      // Delete Key from DB Using Key And Email
      console.log(req.body)
      await Review.remove({productName: req.body.name});
      console.log("Deleted Key");
      res.redirect("/reviews");
    } catch (err) {
      res.redirect("/reviews");
    }
  },
// ------- Photo Routes
//Create A Photo Review
createReview: async (req, res) => {
    console.log(req.body)
    let productName = req.body.productName
    try {
    const image = await cloudinary.uploader.upload(req.file.path);
    await Review.create({
      productName: productName,
      productSize: req.body.productSize,
      productReview: req.body.productReview,
      productLink: req.body.productLink,
      user: req.user.userName,
      rating: req.body.rating,
      key: req.body.key,
      userEmail: req.user.email,
      image: image.secure_url,
      cloudinaryId: image.public_id,
    });
    console.log("Review has been added!");
    res.redirect("/reviews");
  } catch (err) {
    console.log(err);
  }
},


  // createComment: async (req, res) => {
  //   try {
  //     await Comment.create({
  //       comment: req.body.comment,
  //       madeBy: req.user.userName,
  //       postId: req.params.id
  //     });
  //     console.log("Comment has been added!");
  //     res.redirect(`/post/${req.params.id}`);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  // likePost: async (req, res) => {
  //   try {
  //     await Post.findOneAndUpdate(
  //       { _id: req.params.id },
  //       {
  //         $inc: { likes: 1 },
  //       }
  //     );
  //     console.log("Likes +1");
  //     res.redirect(`/post/${req.params.id}`);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
};


// Might Need Later

//      // Upload image to cloudinary
// const result = await cloudinary.uploader.upload(req.file.path);