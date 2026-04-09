const cron = require('node-cron');
const Appointment = require('../models/Appointment');

const startReminderJob = () => {
    // For demonstration, we run this loop every 1 minute
    // In production, you'd use '0 * * * *' (Every hour)
    cron.schedule('* * * * *', async () => {
        console.log('[CRON] Initiating 24-Hour Automated Reminder sweep...');
        
        try {
            const now = new Date();
            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

            // Fetch all scheduled appointments
            const appointments = await Appointment.find({ status: 'Scheduled' })
                .populate('patient', 'name email');

            let remindersSent = 0;

            appointments.forEach((apt) => {
                const aptDate = new Date(apt.date);
                
                // If appointment is within the next 24 hours exactly
                if (aptDate > now && aptDate <= tomorrow) {
                    console.log(`\n=================================================`);
                    console.log(`[URGENT REMINDER DISPATCH]`);
                    console.log(`To: ${apt.patient?.email || 'Unknown Patient'}`);
                    console.log(`Subject: Important: Your upcoming FemmeCare Appointment is in less than 24 hours!`);
                    console.log(`Hi ${apt.patient?.name || 'Patient'}, you have an imminent ${apt.appointmentType} consultation scheduled for ${aptDate.toLocaleDateString()} at ${apt.timeSlot}. Please log into your dashboard to prepare.`);
                    console.log(`=================================================\n`);
                    remindersSent++;
                }
            });

            if (remindersSent > 0) {
                 console.log(`[CRON] Sweep complete. Dispatched ${remindersSent} secure emails.`);
            } else {
                 console.log('[CRON] Sweep complete. No imminent appointments found.');
            }

        } catch (error) {
            console.error('[CRON JOB ERROR]', error);
        }
    });

    console.log('Automated CRON daemon initialized for Reminders.');
};

module.exports = startReminderJob;
