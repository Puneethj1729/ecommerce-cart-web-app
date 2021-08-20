const Sub=require('../models/sub');
const slugify = require ('slugify');
const Product=require('../models/product');
exports.create = async (req, res) => {
  try {
    const {name,parent} = req.body;
    const sub = await new Sub({
      name: name,
      parent,
      slug: slugify (name),
    }).save ();
    res.json (sub);
  } catch (err) {
    res.status (400).send ('Create Sub Category Failed');
  }
};
exports.update = async (req, res) => {
  const {name,parent} = req.body;

  try {
    let updated = await Sub.findOneAndUpdate (
      {slug: req.params.slug},
      {name: name,parent, slug: slugify (name)},
      {new: true}
    ).exec ();
    res.json (updated);
  } catch (err) {
    res.status (400).send ('Sub Category Update Failed');
  }
};

exports.list = async (req, res) => {
  try {
    const subs = await Sub.find ({}).sort ({createdAt: -1}).exec ();
    res.json (subs);
  } catch (err) {
    res.status (400).send ('No Sub Category Found');
  }
};
exports.remove = async (req, res) => {
  try {
    let deleted = await Sub.findOneAndDelete ({
      slug: req.params.slug,
    }).exec ();
    res.json (deleted);
  } catch (err) {
    res.status (400).send ('No Data Found');
  }
};
exports.read = async (req, res) => {
  let sub = await Sub.findOne({ slug: req.params.slug }).exec();
  const products = await Product.find({ subs: sub })
    .populate("category")
    .exec();

  res.json({
    sub,
    products,
  });
};
