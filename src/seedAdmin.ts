import mongoose from 'mongoose';
import Admin from './models/Admin';
import dotenv from 'dotenv';

dotenv.config();

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_CONNECTION_STR || 'mongodb://localhost:27017/tafes_fms');
        console.log("Connected to MongoDB for seeding...");

        const superAdminExists = await Admin.findOne({ role: 'superadmin' });
        if (superAdminExists) {
            console.log("Super Admin already exists.");
        } else {
            const superAdmin = new Admin({
                username: 'tafesexcom',
                password: 'password123',
                role: 'superadmin'
            });
            await superAdmin.save();
            console.log("Super Admin 'tafesexcom' created successfully.");
        }
        process.exit(0);
    } catch (error) {
        console.error("Error seeding Super Admin:", error);
        process.exit(1);
    }
};

seedSuperAdmin();
