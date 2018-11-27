const TrueLayer = require('./../controllers/truelayer');
const User = require('./../controllers/user')



const handleGetRoot = (req, res) => {
    let authUrl = TrueLayer.getAuthUrl(redirectUrl);
    return res.redirect(authUrl);
}

const handleCallback = async (req, res) => {
    try {
        let tokens = await TrueLayer.exchangeCodeForTokens(redirectUrl, req.query.code);
        let userId = await User.createUser(tokens);
  
        // fetch and store bank transactions
        let bankTransactions = await TrueLayer.fetchBankTransactions(tokens.accessToken, userId);
        //await User.storeTransactions(bankTransactions)
  
        // fetch and store card transactions
        let cardTransactions = await TrueLayer.fetchCardTransactions(tokens.accessToken, userId);
        //await User.storeTransactions(cardTransactions);
        return res.status(200).send({userId});
      } catch (err) {
        return res.status(500).send('truelayer-callback-error');
      }
}

module.exports = {
    handleGetRoot,
    handleCallback
}