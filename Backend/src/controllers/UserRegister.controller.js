// const user = require('../Models/user.model')
// const bcrypt = require('bcrypt')

// const UserRegister = async (req, res) => {
//     const { username, email, password, mobileNumber, fullName, bio, avatarUlr } = req.body

//     const exists = await user.findOne({ email })
//     if (exists) {
//         return res.status(401).json({
//             success: false,
//             message: "User is Already exists"
//         })
//     }
//     try {
//           const hashPassword = await bcrypt.hash(password, 10)
//     const createdUser = await user.create({
//         username,
//         email,
//         password: hashPassword,
//         mobileNumber,
//         fullName,
//         bio,
//         avatarUlr
//     })
//     res.status(201).json({
//         success:true,
//         message:"user create successfully",
//     })
//     } catch (error) {
//         console.log(error)
//         res.json({
//             message:error
//         })
//     }
  

// }