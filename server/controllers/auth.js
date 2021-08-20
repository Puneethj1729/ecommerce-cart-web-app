
const User=require('../models/user');
exports.createOrUpdateUser=async (req, res) => {
  const {name,picture,email}=req.user;
  try{
    const user=await User.findOneAndUpdate({email:email},{name:email.split('@')[0],picture:picture},{new:true});
  if (user){
    console.log('USER_UPDATE',user);
    res.json(user);
  }
  else{
    const newUser=await new User({
      name:email.split('@')[0],
      email:email,
      picture:picture
    }).save();
    console.log('USER_CREATED',newUser);
    res.json(newUser);
  }
  }
  catch(err){
    console.log(err);
  };
  
};
exports.currentUser=async(req,res)=>{
  User.findOne({email:req.user.email}).exec((err,user)=>{
    if (err) throw new Error(err);
    res.json(user);
  });
};