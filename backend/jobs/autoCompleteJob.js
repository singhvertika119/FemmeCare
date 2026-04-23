const cron = require('node-cron');
const Appointment = require('../models/Appointment');

const startAutoCompleteJob = () => {
  // Execute daemon cleanly every 15 physical minutes.
  cron.schedule('*/15 * * * *', async () => {
    try {
      const appointments = await Appointment.find({ status: 'Scheduled' });
      const now = new Date();
      let shiftCount = 0;

      for (const apt of appointments) {
        // We append the variables explicitly. Node properly parses "YYYY-MM-DD HH:MM AM" structures accurately!
        const dateTimeString = `${apt.date} ${apt.timeSlot}`;
        const aptDate = new Date(dateTimeString);

        // Security check preventing invalid NaN DB formats from accidentally auto-triggering completion logic
        if (!isNaN(aptDate.getTime()) && aptDate < now) {
          apt.status = 'Completed';
          await apt.save();
          shiftCount++;
        }
      }

      if (shiftCount > 0) {
        console.log(`[CRON] Auto-Complete Sweep Finalized: Shifted ${shiftCount} elapsed appointments strictly to 'Completed'.`);
      }
    } catch (error) {
      console.error("[CRON] Critical failure executing Auto-Complete verification:", error);
    }
  });
  
  console.log('Automated CRON daemon securely initialized for tracking Elapsed Appointments.');
};

module.exports = startAutoCompleteJob;
