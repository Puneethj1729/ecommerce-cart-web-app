const admin=require('../firebase/index');
const User=require('../models/user');
exports.authCheck=async (req,res,next)=>{
    //console.log(req.headers);
    try{
        const firbaseUser=await admin.auth().
        verifyIdToken(req.headers.authtoken);
        req.user=firbaseUser;
        next();
    }
    catch(err){
        res.status(401).json({
            err:'Invalid or Expired Token'
        });
    };
    
};
exports.adminCheck=async(req,res,next)=>{
    const {email}=req.user;
    const adminUser= await User.findOne({email:email}).exec();
    if (adminUser.role!=='admin'){
        res.status(403).json({
            err:'Admin resource, access denied'
        });
    }
    else{
        next();
    }
};