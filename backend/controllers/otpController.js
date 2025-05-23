import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();
import { User } from '../models/User.js';
import axios from 'axios';


const accountSid = process.env.twilio_account_sid;
const authToken  = process.env.twilio_auth_token;
const client = twilio(accountSid, authToken);

// Service SID from Twilio Verify (you should get this from your Twilio Console)
const verificationServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

export const sendOTP = async (phone) => {
    try {

      client.verify.v2.services("VA3ffedce9e8adde40d089600b412d642d")
      .verifications
      .create({to: phone, channel: 'sms'})
      .then(verification => console.log(verification.sid));

      // const verification = await client.verify.v2.services('VA3ffedce9e8adde40d089600b412d642d')
      //       .verifications
      //       .create({ to: phone, channel: 'sms' });

      //   console.log(verification);

        return({ message: 'OTP sent successfully' });
    } catch (error) {
        return(error);
    }
};


  export const verifyOTP = async (phone, otp) => {
      try {
          // Verify the OTP entered by the user
        //   await User.findOneAndUpdate({ phone: phone }, { isVerified: true });

          const verificationCheck = await axios.post(
            `https://verify.twilio.com/v2/Services/${verificationServiceSid}/VerificationCheck`,
            new URLSearchParams({ To: phone, Code: otp }).toString(),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              auth: {
                username: accountSid,
                password: authToken,
              },
            }
          );

          console.log(verificationCheck.data);
          if (verificationCheck.data.status === 'approved') {
              // Mark the user as verified in your User model
              await User.findOneAndUpdate({ phone: phone }, { isVerified: true });
  
              return({ message: 'Phone number verified successfully' });
          } else {
              return({ message: 'Invalid OTP or expired' });
          }
      } catch (error) {
        console.log(error)
        console.log(phone, otp)
          return({ message: 'Failed to verify OTP' });
      }
  };
  


export const resendOTP = async (phone) => {
      console.log(phone);
      if(!phone) {
          return ({ message: 'Phone number is required' });
      } 
      console.log(mobile);
      const user = await User.findOne({phone: phone });
  
      if (!user) {
          return ({ message: 'User not found' });
      }
      const result = await sendOTP(phone);
      if (result.error) {
          return ({ message: 'Failed to send OTP' });
      }
      return({ message: 'OTP resent successfully' });
    }