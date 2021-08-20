const Category=require('../models/category');
const slugify=require('slugify');
const Sub = require ('../models/sub');
const Product =require('../models/product')
exports.create=async(req,res)=>{
    try{
        const {name}=req.body;
        const category=await new Category({name:name,slug:slugify(name)}).save();
        res.json(category);
    }
    catch(err){
        res.status(400).send("Create Category Failed");
    }
}
exports.update =async (req, res) => {
    const {name} = req.body;

     try{
        let updated=await Category.findOneAndUpdate({slug:req.params.slug},{name:name,slug:slugify(name)},{new:true}).exec();
        res.json(updated);
    }
    catch(err){
        res.status(400).send('Category Update Failed');
    }
};

exports.list = async(req, res) => {
    try{
        const categories=await Category.find({}).sort({createdAt:-1}).exec();
        res.json(categories);
    }
    catch(err){
        res.status(400).send('No Category Found');
    }
};
exports.remove=async(req,res)=>{
    try{
        let deleted=await Category.findOneAndDelete({slug:req.params.slug}).exec();
        res.json(deleted);
    }
    catch(err){
        res.status(400).send('No Data Found');
    }
}
exports.read=async(req,res)=>{
    let category = await Category.findOne({ slug: req.params.slug }).exec();
  const products = await Product.find({ category }).populate("category").exec();

  res.json({
    category,
    products,
  });

}

exports.getSubs = (req, res) => {
  Sub.find ({parent: req.params._id}).exec ((err, subs) => {
    if (err) console.log (err);
    res.json (subs);
  });
};
