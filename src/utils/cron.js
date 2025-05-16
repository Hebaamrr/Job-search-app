import cron from "node-cron"
import userModel from "../DB/models/user.model.js"

export const cronjob=()=>{
    cron.schedule("0 */6 * * *", async () => {
        try {
          const now = new Date();
          const result = await userModel.updateMany({ OTP:[{expiresIn: { $lt: now }} ]},{$unset:{OTP:0}});
          console.log(`[CRON JOB] Deleted ${result.deletedCount} expired OTPs at ${now}`);
        } catch (error) {
          console.error("[CRON JOB] Error deleting expired OTPs:", error);
        }
      });
}