import User from '../model/userModel.js'
import AuthToken from '../model/authTokenModel.js'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY

// export const create = async (req, res) => {
//     try {
//         const userData = new User(req.body);
//         const { email } = userData;

//         const userExist = await User.findOne({ email })
//         if (userExist) {
//             return res.status(400).json({
//                 error: true,
//                 message: "User already exists."
//             })
//         }

//         const savedUser = await userData.save()
//         res.status(201).json({
//             error: false,
//             message: "User created!",
//             data: savedUser
//         })
//     } catch (error) {
//         res.status(500).json({
//             error: true,
//             message: "Internal server error."
//         })
//     }
// }

// export const fetch = async (req, res) => {
//     try {
//         const users = await User.find()
//         if (users.length === 0) {
//             return res.status(404).json({
//                 error: true,
//                 message: "User not found."
//             })
//         }
//         res.status(200).json({
//             error: false,
//             message: "OK",
//             data: users
//         })
//     } catch (error) {
//         res.status(500).json({
//             error: true,
//             message: "Internal server error."
//         })
//     }
// }

// export const update = async (req, res) => {
//     try {
//         const id = req.params.id
//         const userExist = await User.findOne({ _id: id })
//         if (!userExist) {
//             return res.status(404).json({
//                 error: true,
//                 message: "User not found."
//             })
//         }
//         const updateUser = await User.findByIdAndUpdate(id, req.body, { new: true })
//         res.status(201).json({
//             error: false,
//             message: "User updated!",
//             data: updateUser
//         })
//     } catch (error) {
//         res.status(500).json({
//             error: true,
//             message: "Internal server error."
//         })
//     }
// }

// export const deleteUser = async (req, res) => {
//     try {
//         const id = req.params.id
//         const userExist = await User.findOne({ _id: id })
//         if (!userExist) {
//             return res.status(404).json({
//                 error: true,
//                 message: "User not found."
//             })
//         }
//         await User.findByIdAndDelete(id)
//         res.status(201).json({
//             error: false,
//             message: "User deleted success."
//         })
//     } catch (error) {
//         res.status(500).json({
//             error: true,
//             message: "Internal server error."
//         })
//     }
// }

export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body

        // Check if user with e-mail already exists.
        const userExist = await User.findOne({ email })
        if (userExist) return res.status(400).json({
            error: true,
            message: "User already exists."
        })

        // Generate username.
        const randomSuffix = Math.random().toString(36).substring(2, 7)
        const username = `${firstName.toLowerCase()}${randomSuffix}`

        // Hash the password.
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        // Create the new user with required fields, others set to null
        const newUser = new User({
            firstName,
            lastName,
            email,
            username,
            passwordHash,
            birthdate: null,
            gender: null,
            biography: null,
            role: "user",
            status: "active",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })

        // Save the user to the database
        const savedUser = await newUser.save()

        res.status(201).json({
            error: false,
            message: "User registered successfully!",
            data: savedUser
        })
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Check if user with e-mail exist.
        const userExist = await User.findOne({ email })
        if (!userExist) return res.status(400).json({
            error: true,
            message: "Invalid e-mail address."
        })
        if (userExist.status == "banned") return res.status(400).json({
            error: true,
            message: "User already banned."
        })

        // Verify the password.
        const isPasswordValid = await bcrypt.compare(password, userExist.passwordHash)
        if (!isPasswordValid) return res.status(400).json({
            error: true,
            message: "Invalid password."
        })

        // Generate a JWT token.
        const token = jwt.sign(
            { userId: userExist._id },
            SECRET_KEY,
            { expiresIn: "7d" }
        )

        // Calculate token expiration time
        const currentDateTime = new Date()
        const expirationDateTime = new Date(currentDateTime.getTime() + 7 * 24 * 60 * 60 * 1000)

        // Save the token in the database
        const authToken = new AuthToken({
            userId: userExist._id,
            token,
            createdAt: new Date().toISOString(),
            expiredAt: expirationDateTime.toISOString()
        })
        const saveToken = await authToken.save()
        res.status(201).json({
            error: false,
            message: "Log In successful!",
            data: {
                user: {
                    _id: userExist._id,
                    username: userExist.username
                },
                token: saveToken.token
            }
        })
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error
        })
    }
}

export const update = async (req, res) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: true,
                message: "User not logged in."
            })
        }

        const token = authHeader.split(' ')[1]
        const tokenExist = await AuthToken.findOne({ token })

        if (!tokenExist) {
            return res.status(401).json({
                error: true,
                message: "User not logged in."
            });
        }

        const userId = tokenExist.userId
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true })

        if (!updatedUser) {
            return res.status(404).json({
                error: true,
                message: "User not found."
            })
        }

        res.status(200).json({
            error: false,
            message: "User updated successfully.",
            data: updatedUser
        });
    } catch (error) {
        console.error("Error updating user:", error)
        res.status(500).json({
            error: true,
            message: "Internal server error."
        })
    }
}

export const logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({
            error: true,
            message: "Authorization header is missing or malformed."
        })

        const token = authHeader.split(' ')[1];
        const tokenExist = await AuthToken.findOne({ token });

        if (!tokenExist) return res.status(404).json({
            error: true,
            message: "Session already ended."
        })

        await AuthToken.deleteOne({ token });
        res.status(200).json({
            error: false,
            message: "Logout successful."
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error
        })
    }
}