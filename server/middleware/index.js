const axios = require('axios');
const jwt = require('jsonwebtoken');




let verifyAndDecode =  (token) => {
  try {
    const key = process.env.TWITCH_EXTENSION;
    const secret = Buffer.from(key, 'base64');
    
    return jwt.verify(token, secret, { algorithms: ['HS256'] });
  }
  catch (e) {
    return console.log('Invalid JWT');
  }
    
}
let TwitchInfo = (req, callback) => {
    
    //use session token
    let token = req.twitchSession;
    if(token){
      let userInfo = verifyAndDecode(token);
      if(!userInfo){
        console.log('Cant decode userInfo.');
        return req;
      }
      axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`).then((r) => {
          let access_token = r.data.access_token;
          axios.get(`https://api.twitch.tv/helix/users?id=${userInfo.user_id}`, {
            headers:{
              'Client-ID': process.env.TWITCH_CLIENT_ID,
              'Authorization': `Bearer ${access_token}`,
              'Accept': 'application/json'
            }
          }).then((response) => {
            req.twitch = response.data.data[0];
            callback(null, req);         
          }).catch((error) => {
            callback(error);
          })
      }).catch((e) => {
        callback(e);         
      });
  }
  else{
    callback('No twitch session defined? They could be requesting from the frontend.');
  }
};
module.exports = {
    TwitchInfo
}





