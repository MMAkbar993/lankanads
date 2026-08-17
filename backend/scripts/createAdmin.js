const mongoose = require("mongoose");
const Admin = require("../models/Admin");
require("dotenv").config();

const parseArgs = () => {
    const args = {};

    process.argv.slice(2).forEach((arg) => {
        const match = arg.match(/^--([^=]+)=(.*)$/);
        if (match) {
            args[match[1]] = match[2];
        }
    });

    return args;
};

const createAdmin = async () => {
    try {
        const { email, password, name } = parseArgs();

        if (!email || !password) {
            console.error(
                'Usage: node scripts/createAdmin.js --email=you@example.com --password=yourpassword [--name="Your Name"]'
            );
            process.exit(1);
        }

        if (password.length < 6) {
            console.error("Password must be at least 6 characters.");
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);

        const normalizedEmail = email.toLowerCase();
        const existingAdmin = await Admin.findOne({ email: normalizedEmail });

        if (existingAdmin) {
            console.log("An admin with this email already exists:", normalizedEmail);
            process.exit(0);
        }

        await Admin.create({
            name: name || "Admin",
            email: normalizedEmail,
            password,
            role: "admin",
            status: "active",
        });

        console.log("Admin created successfully");
        console.log("Email:", normalizedEmail);

        process.exit(0);
    } catch (error) {
        console.error("Create Admin Error:", error);
        process.exit(1);
    }
};

createAdmin();